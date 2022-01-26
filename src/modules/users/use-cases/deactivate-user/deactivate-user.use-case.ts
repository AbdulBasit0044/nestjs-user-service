import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { EventTYPE } from '@common/constants'
import { ObjectNotFoundError } from '@common/errors'
import { UserDeactivatedEvent } from '@modules/users/events'
import { UserRepository } from '@modules/users/repositories'

export interface DeactivateUserParams {
  userId: string
}

@Injectable()
export class DeactivateUserUseCase implements IUseCase<DeactivateUserParams, Boolean> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute({ userId }: DeactivateUserParams): Promise<Boolean> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'User'
      })
    }

    if (user.meetingTier) {
      user.oldMeetingTier = user.meetingTier
    }

    user.cancelledAccount = new Date()
    user.meetingTier = null
    user.paidMeetingsUser = null
    const res = await this.userRepository.update(user.id, user)
    if (res) {
      const event = new UserDeactivatedEvent(userId)
      this.eventEmitter.emit(EventTYPE.USER_DEACTIVATED_EVENT, event)
    }
    return Boolean(res)
  }
}
