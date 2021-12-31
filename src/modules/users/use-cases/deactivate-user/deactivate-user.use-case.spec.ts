import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { ObjectNotFoundError } from '@common/errors'
import { UserRepository } from '@modules/users/repositories'
import { DeactivateUserUseCase } from '@modules/users/use-cases'
import { createTestUser } from '@modules/users/fixtures'

const userId = newObjectId()
const testUser = createTestUser({
  _id: userId
})

describe('DeactivateUserUseCase', () => {
  let deactiveUserUseCase: DeactivateUserUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeactivateUserUseCase,
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
    deactiveUserUseCase = await module.get(DeactivateUserUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(deactiveUserUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  it('should throw object not found exception', async () => {
    const fakeUserId = newObjectId()
    const promise = deactiveUserUseCase.execute({ userId: fakeUserId })
    await expect(promise).rejects.toThrow(ObjectNotFoundError)
  })

  it('should deactivate user', async () => {
    jest.spyOn(userRepository, 'getById').mockResolvedValue(testUser)
    jest.spyOn(userRepository, 'update').mockResolvedValue(testUser)
    const res = await deactiveUserUseCase.execute({ userId })
    expect(res).toEqual(true)
  })
})
