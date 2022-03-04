import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'

export interface GetUsersByidParams {
  ids: string[]

  select?: string[]
}

@Injectable()
export class GetUsersByIdUseCase implements IUseCase<GetUsersByidParams, User[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ ids, select }: GetUsersByidParams): Promise<User[]> {
    const users = await this.userRepository.getByIds(ids, select)
    return users
  }
}
