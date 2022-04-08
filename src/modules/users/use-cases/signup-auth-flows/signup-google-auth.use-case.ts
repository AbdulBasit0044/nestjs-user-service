import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { getGoogleIdentity, getGoogleTokens } from '@modules/users/google-office-auth-functions'
import { User } from '@modules/users/models'
import { GoogleAuthSignUpDto } from '@modules/users/dto'
import { BaseAuthFlowUseCaseInput } from '@modules/users/types'
import { BaseAuthFlowUseCase } from './base-auth-flow.use-case'

export type GoogleAuthSignUpParams = GoogleAuthSignUpDto

@Injectable()
export class SignUpGoogleAuthUseCase implements IUseCase<GoogleAuthSignUpParams, User> {
  constructor(private readonly baseAuthFlow: BaseAuthFlowUseCase) {}

  async execute(input: GoogleAuthSignUpDto): Promise<User> {
    const tokens = await getGoogleTokens(input.code)
    const identity = await getGoogleIdentity(tokens.accessToken)
    const baseAuthFlowInput: BaseAuthFlowUseCaseInput = {
      authDto: tokens,
      identity,
      signUpDto: input
    }
    const userRecord = await this.baseAuthFlow.execute(baseAuthFlowInput)
    return userRecord
  }
}
