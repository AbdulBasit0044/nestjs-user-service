import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { isExpiredByTimestamp } from '@common/utils'
import { User } from '@modules/users/models'
import { ValidityAndProviderResponse } from '@modules/users/types'

@Injectable()
export class ValidityAndProviderUseCase implements IUseCase<User, [ValidityAndProviderResponse]> {
  execute(user: User): [ValidityAndProviderResponse] {
    const providers: any = []

    if (user.gauth) {
      const provider = 'gauth'
      const isValid = this.isvalid(user, provider)
      providers.push({ provider, isValid })
    }
    if (user.officeAuth) {
      const provider = 'officeAuth'
      const isValid = this.isvalid(user, provider)
      providers.push({ provider, isValid })
    }

    return providers
  }

  isvalid(user, provider) {
    const isExpired = isExpiredByTimestamp(user[provider]?.expires_at)
    const isValid = !!(provider && user[provider]?.refresh_token && !isExpired)
    return isValid
  }
}
