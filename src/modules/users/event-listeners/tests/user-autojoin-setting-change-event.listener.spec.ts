import { Test } from '@nestjs/testing'
import { UserAutojoinSettingChangeEvent } from '@modules/users/events'
import { UserAutojoinSettingChangeEventListener } from '@modules/users/event-listeners'
import { PubSubService } from '@modules/global-configs/services'

const testEvent = new UserAutojoinSettingChangeEvent(
  'user_id',
  'example@gmail.com',
  'auto',
  'manual'
)

describe('userAutojoinSettingChangeEventListener', () => {
  let userAutojoinSettingChangeEventListener: UserAutojoinSettingChangeEventListener

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserAutojoinSettingChangeEventListener,
        {
          provide: PubSubService,
          useValue: {
            sendMessageToTopic: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()
    userAutojoinSettingChangeEventListener = await module.get(UserAutojoinSettingChangeEventListener)
  })

  it('should process event successfully', async () => {
    const response = await userAutojoinSettingChangeEventListener.handleOnAutojoinSettingChangeEvent(
      testEvent
    )
    expect(response).toBeFalsy()
  })
})
