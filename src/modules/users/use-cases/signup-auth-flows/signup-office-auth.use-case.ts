import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import {
  getOffice365Identity,
  getOffice365Tokens
} from '@modules/users/google-office-auth-functions'
import { User } from '@modules/users/models'
import { MsOfficeSignUpDto } from '@modules/users/dto'
import { BaseAuthFlowUseCaseInput } from '@modules/users/types'
import { BaseAuthFlowUseCase } from './base-auth-flow.use-case'

export type OfficeAuthSignUpParams = MsOfficeSignUpDto

@Injectable()
export class SignUpOfficeAuthUseCase implements IUseCase<OfficeAuthSignUpParams, User> {
  constructor(private readonly baseAuthFlow: BaseAuthFlowUseCase) {}

  async execute(input: MsOfficeSignUpDto): Promise<User> {
    const tokens = await getOffice365Tokens(input.code)
    const identity = await getOffice365Identity(tokens.accessToken)
    const baseAuthFlowInput: BaseAuthFlowUseCaseInput = {
      authDto: tokens,
      identity,
      signUpDto: input
    }
    const userRecord = await this.baseAuthFlow.execute(baseAuthFlowInput)
    return userRecord
  }
}
