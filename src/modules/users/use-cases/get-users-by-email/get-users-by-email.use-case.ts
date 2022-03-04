import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'

export interface GetUsersByEmailParams {
  emails: string[]

  select?: string[]
}

@Injectable()
export class GetUsersByEmailUseCase implements IUseCase<GetUsersByEmailParams, User[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ emails, select }: GetUsersByEmailParams): Promise<User[]> {
    const users = await this.userRepository.getByEmails(emails, select)
    return users
  }
}
