import { Test } from '@nestjs/testing'
import { UserCreatedEvent } from '@modules/users/events'
import { createTestUser } from '@modules/users/fixtures'
import { UserCreatedEventListener } from '@modules/users/event-listeners'
import { PubSubService } from '@modules/global-configs/services'

const testUser = createTestUser()

const testEvent = new UserCreatedEvent(testUser, 'token123')

describe('userCreatedEventListener', () => {
  let userCreatedEventListener: UserCreatedEventListener

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserCreatedEventListener,
        {
          provide: PubSubService,
          useValue: {
            sendMessageToTopic: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()
    userCreatedEventListener = await module.get(UserCreatedEventListener)
  })

  it('should process event successfully', async () => {
    const response = await userCreatedEventListener.handleOnCreatedEvent(testEvent)
    expect(response).toBeFalsy()
  })
})
