import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { EventTYPE, ActionType } from '@common/constants'
import { ObjectNotFoundError, BannedUserError } from '@common/errors'
import { UserCreatedEvent } from '@modules/users/events'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'

export interface ReactivateUserParams {
  userId: string
}

@Injectable()
export class ReactivateUserUseCase implements IUseCase<ReactivateUserParams, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute({ userId }: ReactivateUserParams): Promise<User> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'User'
      })
    }
    const meetingTier = user?.meetingTier || 'portalBypass'
    // check if user is banned
    if (meetingTier.toLowerCase() === 'banned') {
      throw new BannedUserError({
        userId: user.id,
        emailAddress: user.email
      })
    }

    await this.userRepository.update(user.id, { cancelledAccount: null })
    this.publishUserCreatedEvent(user, ActionType.USER_REACTIVATED)
    return user
  }

  private publishUserCreatedEvent(user: User, token: string) {
    const event = new UserCreatedEvent(user, token)
    this.eventEmitter.emit(EventTYPE.USER_CREATED_EVENT, event)
  }
}
