import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { PaginatedList } from '@common/models'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'
import { GetAllUsersParams } from '@modules/grpc/user/user.type'

@Injectable()
export class GetAllUsersUseCase implements IUseCase<any, PaginatedList<User>> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    select,
    page,
    pageSize,
    sort,
    order
  }: GetAllUsersParams): Promise<PaginatedList<User>> {
    const users = await this.userRepository.getAll({ select, page, pageSize, sort, order })
    return users
  }
}
