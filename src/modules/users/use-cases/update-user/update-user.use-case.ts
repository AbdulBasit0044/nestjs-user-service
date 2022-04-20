import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { ObjectNotFoundError } from '@common/errors'
import { UserRepository } from '@modules/users/repositories'
import { User } from '@modules/users/models'
import { UpdateUserDto } from '@modules/users/dto'

export interface UpdateUserParams {
  userId: string
  data: UpdateUserDto
}

@Injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserParams, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, data }: UpdateUserParams): Promise<User> {
    const user = await this.userRepository.update(userId, data)

    if (!user) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'User'
      })
    }

    return user
  }
}
