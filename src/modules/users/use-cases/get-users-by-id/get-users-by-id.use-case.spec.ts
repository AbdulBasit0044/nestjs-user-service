import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { GetUsersByIdUseCase } from './get-users-by-id.use-case'

describe('GetUsersByidsUseCase', () => {
  let getUsersByIdUseCase: GetUsersByIdUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUsersByIdUseCase,
        {
          provide: UserRepository,
          useValue: {
            getByIds: jest.fn()
          }
        }
      ]
    }).compile()

    getUsersByIdUseCase = await module.get(GetUsersByIdUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(getUsersByIdUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get multiple users without select', async () => {
      const userId = newObjectId()
      const fakeUser1 = createTestUser({
        id: userId
      })
      const id2 = newObjectId()
      const fakeUser2 = createTestUser({
        id: id2
      })
      jest.spyOn(userRepository, 'getByIds').mockResolvedValue([fakeUser1, fakeUser2])
      const ids = [userId, id2]
      const users = await getUsersByIdUseCase.execute({ ids })
      expect(userRepository.getByIds).toHaveBeenCalledWith(ids, undefined)
      expect(users[0]).toEqual(fakeUser1)
    })

    it('should get multiple users with select', async () => {
      const userId = newObjectId()
      const fakeUser1 = createTestUser({
        id: userId
      })
      const id2 = newObjectId()
      const fakeUser2 = createTestUser({
        id: id2
      })
      jest.spyOn(userRepository, 'getByIds').mockResolvedValue([fakeUser1, fakeUser2])
      const ids = [userId, id2]
      const users = await getUsersByIdUseCase.execute({ ids, select: ['email'] })
      expect(userRepository.getByIds).toHaveBeenCalledWith(ids, ['email'])
      expect(users[0]).toEqual(fakeUser1)
    })
    it('should return empty array', async () => {
      const ids = ['aadadad']
      jest.spyOn(userRepository, 'getByIds').mockResolvedValue([])
      const users = await getUsersByIdUseCase.execute({ ids })
      expect(userRepository.getByIds).toHaveBeenCalledWith(ids, undefined)
      expect(users).toEqual([])
    })
  })
})
