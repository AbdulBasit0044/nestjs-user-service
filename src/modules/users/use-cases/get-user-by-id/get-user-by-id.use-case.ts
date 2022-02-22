import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'

export interface GetUserByIdParams {
  userId: string

  select?: string[]
}

@Injectable()
export class GetUserByIdUseCase implements IUseCase<GetUserByIdParams, User | null> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, select }: GetUserByIdParams): Promise<User | null> {
    const user = await this.userRepository.getById(userId, select)
    return user
  }
}
