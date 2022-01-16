import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { ActionType, EventTYPE } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { UserDeletedEvent } from '@modules/users/events'

@Injectable()
export class UserDeletedEventListener {
  public constructor(private pubSubService: PubSubService) {}

  @OnEvent(EventTYPE.USER_DELETED_EVENT, { async: true })
  async handleOnDeletedEvent(event: UserDeletedEvent) {
    const pubSubMessage = {
      id: event.userId,
      action: ActionType.USER_DELETED
    }
    await this.pubSubService.sendMessageToTopic(pubSubMessage)
  }
}
