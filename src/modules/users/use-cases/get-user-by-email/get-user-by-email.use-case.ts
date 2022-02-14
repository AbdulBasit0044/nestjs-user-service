import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'

export interface GetUserByEmailParams {
  email: string

  select?: string[]
}

@Injectable()
export class GetUserByEmailUseCase implements IUseCase<GetUserByEmailParams, User | null> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email, select }: GetUserByEmailParams): Promise<User | null> {
    const user = await this.userRepository.getByEmail(email, select)
    return user
  }
}
