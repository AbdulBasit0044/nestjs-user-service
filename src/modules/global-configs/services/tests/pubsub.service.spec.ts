import { Test } from '@nestjs/testing'
import { PubSubService } from '../pubsub.service'

jest.mock('@google-cloud/pubsub')

describe('pubsub service test suite', () => {
  let pubsubService: PubSubService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [PubSubService]
    }).compile()
    pubsubService = await module.get(PubSubService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(pubsubService).toBeDefined()
  })

  it('should throw error if message is null', async () => {
    await expect(pubsubService.sendMessageToTopic(null)).rejects.toThrowError()
  })
})
