import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { ObjectNotFoundError, BannedUserError } from '@common/errors'
import { UserRepository } from '@modules/users/repositories'
import { ReactivateUserUseCase } from '@modules/users/use-cases'
import { createTestUser } from '@modules/users/fixtures'

const userId = newObjectId()
const testUser = createTestUser({
  _id: userId
})

describe('ReactivateUserUseCase', () => {
  let reactiveUserUseCase: ReactivateUserUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReactivateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            getById: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn().mockResolvedValue(true)
          }
        }
      ]
    }).compile()
    reactiveUserUseCase = await module.get(ReactivateUserUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(reactiveUserUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should throw object not found exception', async () => {
    const fakeUserId = newObjectId()
    const promise = reactiveUserUseCase.execute({ userId: fakeUserId })
    await expect(promise).rejects.toThrow(ObjectNotFoundError)
  })

  it('should throw banned user expection when banned user is reactivated', async () => {
    const id = newObjectId()
    const bannedUser = createTestUser({
      _id: id,
      meetingTier: 'banned'
    })
    jest.spyOn(userRepository, 'getById').mockResolvedValue(bannedUser)
    const promise = reactiveUserUseCase.execute({ userId: id })
    await expect(promise).rejects.toThrow(BannedUserError)
  })

  it('should reactivate user', async () => {
    jest.spyOn(userRepository, 'getById').mockResolvedValue(testUser)
    jest.spyOn(userRepository, 'update').mockResolvedValue(testUser)
    const publishUserCreatedEvent = jest.spyOn(
      ReactivateUserUseCase.prototype as any,
      'publishUserCreatedEvent'
    )
    publishUserCreatedEvent.mockImplementation(() => {
      return true
    })
    const user = await reactiveUserUseCase.execute({ userId })
    expect(user).toEqual(testUser)
  })
})
