import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { refreshOfficeToken } from '@modules/users/google-office-auth-functions'
import { AuthUserObject } from '@modules/users/types'

interface RefreshTokenParams {
  refreshToken: string
}

@Injectable()
export class RefreshOfficeTokenUseCase implements IUseCase<RefreshTokenParams, AuthUserObject> {
  async execute(input: RefreshTokenParams): Promise<AuthUserObject> {
    const officeAuthTokens = await refreshOfficeToken(input.refreshToken)

    return officeAuthTokens
  }
}
