import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { IUseCase } from '@common/types'
import { EventTYPE } from '@common/constants'
import { logError } from '@common/logger'
import { User } from '@modules/users/models'
import { UserRepository } from '@modules/users/repositories'
import { RefreshTokenFailedEvent } from '@modules/users/events'
import { ValidityAndProviderUseCase } from './validity-and-provider.use-case'
import { RefreshGoogleTokenUseCase } from './refresh-google-token.use-case'
import { RefreshOfficeTokenUseCase } from './refresh-office-token.use-case'

@Injectable()
export class RefreshTokenUseCase implements IUseCase<User, User> {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userRepository: UserRepository,
    private readonly validityAndProviderUseCase: ValidityAndProviderUseCase,
    private readonly refreshGoogleTokenUseCase: RefreshGoogleTokenUseCase,
    private readonly refreshOfficeTokenUseCase: RefreshOfficeTokenUseCase
  ) {}

  async execute(user: User): Promise<User> {
    const providers = this.validityAndProviderUseCase.execute(user)
    const promises: any = []
    providers.forEach(el => {
      const { isValid, provider } = el
      if (!isValid) {
        if (provider === 'gauth' && user.gauth) {
          promises.push(
            this.refreshGoogleTokenUseCase.execute({
              refreshToken: user.gauth.refresh_token
            })
          )
        } else if (provider === 'officeAuth' && user.officeAuth) {
          promises.push(
            this.refreshOfficeTokenUseCase.execute({
              refreshToken: user.officeAuth.refresh_token
            })
          )
        }
      }
    })

    try {
      const refreshedTokens: any = await Promise.allSettled(promises)
      let userRecord = user
      refreshedTokens.forEach(async authObject => {
        if (authObject.status === 'fulfilled') {
          userRecord = await this.userRepository.updateUserAuth(userRecord, authObject.value)
        }
      })

      return userRecord
    } catch (e) {
      logError({
        action: EventTYPE.REFRESH_TOKEN_FAILED_EVENT,
        document: e,
        requestId: user.id,
        serviceName: 'user-service' // TODO: get appropriate service name
      })
      const event = new RefreshTokenFailedEvent(user.id)
      this.eventEmitter.emit(EventTYPE.REFRESH_TOKEN_FAILED_EVENT, event)
      return user
    }
  }
}
