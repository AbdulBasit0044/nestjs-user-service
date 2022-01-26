import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { EventTYPE } from '@common/constants'
import { ObjectNotFoundError } from '@common/errors'
import { UserRepository } from '@modules/users/repositories'
import { UserDeletedEvent } from '@modules/users/events'

export interface DeleteUserByIdParams {
  userId: string
}

@Injectable()
export class DeleteUserByIdUseCase implements IUseCase<DeleteUserByIdParams, boolean> {
  constructor(
    private readonly userRepository: UserRepository,
    private eventEmitter: EventEmitter2
  ) {}

  async execute({ userId }: DeleteUserByIdParams): Promise<boolean> {
    const res = await this.userRepository.deleteById(userId)
    if (!res) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'User'
      })
    }
    const event = new UserDeletedEvent(userId)
    this.eventEmitter.emit(EventTYPE.USER_DELETED_EVENT, event)

    return res
  }
}
