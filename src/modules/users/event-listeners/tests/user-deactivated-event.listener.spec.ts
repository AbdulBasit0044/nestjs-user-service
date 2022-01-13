import { Test } from '@nestjs/testing'
import { UserDeactivatedEvent } from '@modules/users/events'
import { UserDeactivatedEventListener } from '@modules/users/event-listeners'
import { PubSubService } from '@modules/global-configs/services'

const testEvent = new UserDeactivatedEvent('test123')

describe('userDeactivatedEventListener', () => {
  let userDeactivatedEventListener: UserDeactivatedEventListener

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserDeactivatedEventListener,
        {
          provide: PubSubService,
          useValue: {
            sendMessageToTopic: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()
    userDeactivatedEventListener = await module.get(UserDeactivatedEventListener)
  })

  it('should process event successfully', async () => {
    const response = await userDeactivatedEventListener.handleOnDeactivatedEvent(testEvent)
    expect(response).toBeFalsy()
  })
})
