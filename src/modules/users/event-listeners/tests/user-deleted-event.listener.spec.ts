import { Test } from '@nestjs/testing'
import { UserDeletedEvent } from '@modules/users/events'
import { UserDeletedEventListener } from '@modules/users/event-listeners'
import { PubSubService } from '@modules/global-configs/services'

const testEvent = new UserDeletedEvent('test123')

describe('userDeletedEventListener', () => {
  let userDeletedEventListener: UserDeletedEventListener

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserDeletedEventListener,
        {
          provide: PubSubService,
          useValue: {
            sendMessageToTopic: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()

    userDeletedEventListener = await module.get(UserDeletedEventListener)
  })

  it('should process event successfully', async () => {
    const response = await userDeletedEventListener.handleOnDeletedEvent(testEvent)
    expect(response).toBeFalsy()
  })
})
