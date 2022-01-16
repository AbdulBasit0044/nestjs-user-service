import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { ActionType, EventTYPE } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { UserDeactivatedEvent } from '@modules/users/events'

@Injectable()
export class UserDeactivatedEventListener {
  public constructor(private readonly pubSubService: PubSubService) {}

  @OnEvent(EventTYPE.USER_DEACTIVATED_EVENT, { async: true })
  async handleOnDeactivatedEvent(event: UserDeactivatedEvent) {
    // send user and token generated from jwt to pubsub
    const pubSubMessage = {
      id: event.userId,
      action: ActionType.USER_DEACTIVATED
    }
    await this.pubSubService.sendMessageToTopic(pubSubMessage)
  }
}
