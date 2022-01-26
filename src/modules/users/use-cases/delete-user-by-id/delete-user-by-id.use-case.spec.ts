import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { ObjectNotFoundError } from '@common/errors'
import { UserDeletedEvent } from '@modules/users/events'
import { UserRepository } from '@modules/users/repositories'
import { DeleteUserByIdUseCase } from './delete-user-by-id.use-case'

describe('DeleteUserByIdUseCase', () => {
  let deleteUserByIdUseCase: DeleteUserByIdUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteUserByIdUseCase,
        EventEmitter2,
        UserDeletedEvent,
        {
          provide: UserRepository,
          useValue: {
            deleteById: jest.fn()
          }
        }
      ]
    }).compile()

    deleteUserByIdUseCase = await module.get(DeleteUserByIdUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(deleteUserByIdUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should delete user', async () => {
      const userId = newObjectId()
      jest.spyOn(userRepository, 'deleteById').mockResolvedValue(true)
      const res = await deleteUserByIdUseCase.execute({ userId })
      expect(userRepository.deleteById).toHaveBeenCalledWith(userId)
      expect(res).toEqual(true)
    })
    it('should throw object not found error', async () => {
      const userId = newObjectId()
      jest.spyOn(userRepository, 'deleteById').mockResolvedValue(false)
      const promise = deleteUserByIdUseCase.execute({ userId })
      expect(userRepository.deleteById).toHaveBeenCalledWith(userId)
      await expect(promise).rejects.toThrow(ObjectNotFoundError)
    })
  })
})
