import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { ActionType, EventTYPE } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { UserAutojoinSettingChangeEvent } from '@modules/users/events'

@Injectable()
export class UserAutojoinSettingChangeEventListener {
  public constructor(private readonly pubSubService: PubSubService) {}

  @OnEvent(EventTYPE.USER_CREATED_EVENT, { async: true })
  async handleOnAutojoinSettingChangeEvent(event: UserAutojoinSettingChangeEvent) {
    // send user setting change to pubsub
    const pubSubMessage = {
      ...event,
      action: ActionType.USER_AUTOJOIN_SETTING_CHANGED
    }
    await this.pubSubService.sendMessageToTopic(pubSubMessage)
  }
}
