import { Injectable } from '@nestjs/common'
import { ObjectAlreadyExistsError } from '@common/errors'
import { IUseCase } from '@common/types'
import { User } from '@modules/users/models'
import { UserRepository } from '@modules/users/repositories'
import { SignUpDto } from '@modules/users/dto'

export type SignUpParams = SignUpDto

@Injectable()
export class SignUpUseCase implements IUseCase<SignUpParams, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SignUpParams): Promise<User> {
    const existsUser = await this.userRepository.existsByEmail(input.email)

    if (existsUser) {
      throw new ObjectAlreadyExistsError({
        field: 'email',
        objectType: 'User'
      })
    }

    const user = await this.userRepository.create(input)

    return user
  }
}
