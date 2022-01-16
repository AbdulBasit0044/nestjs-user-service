import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { ActionType, EventTYPE } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { UserCreatedEvent } from '@modules/users/events'

@Injectable()
export class UserCreatedEventListener {
  public constructor(private readonly pubSubService: PubSubService) {}

  @OnEvent(EventTYPE.USER_CREATED_EVENT, { async: true })
  async handleOnCreatedEvent(event: UserCreatedEvent) {
    // send user and token generated from jwt to pubsub
    const pubSubMessage = {
      id: event.user.id,
      action: ActionType.USER_CREATED
    }
    await this.pubSubService.sendMessageToTopic(pubSubMessage)
  }
}
