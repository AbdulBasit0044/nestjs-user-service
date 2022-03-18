import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { refreshGoogleToken } from '@modules/users/google-office-auth-functions'
import { AuthUserObject } from '@modules/users/types'

interface RefreshTokenParams {
  refreshToken: string
}

@Injectable()
export class RefreshGoogleTokenUseCase implements IUseCase<RefreshTokenParams, AuthUserObject> {
  async execute(input: RefreshTokenParams): Promise<AuthUserObject> {
    const gauthTokens = await refreshGoogleToken(input.refreshToken)

    return gauthTokens
  }
}
