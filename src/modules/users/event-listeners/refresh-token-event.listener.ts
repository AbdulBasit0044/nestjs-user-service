import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { ActionType, EventTYPE } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { RefreshTokenFailedEvent } from '@modules/users/events'

@Injectable()
export class RefreshTokenEventListener {
  public constructor(private readonly pubSubService: PubSubService) {}

  @OnEvent(EventTYPE.REFRESH_TOKEN_FAILED_EVENT, { async: true })
  async handleOnFailedEvent(event: RefreshTokenFailedEvent) {
    const pubSubMessage = {
      id: event.userId,
      action: ActionType.REFRESH_TOKEN_FAILED
    }
    await this.pubSubService.sendMessageToTopic(pubSubMessage)
  }
}
