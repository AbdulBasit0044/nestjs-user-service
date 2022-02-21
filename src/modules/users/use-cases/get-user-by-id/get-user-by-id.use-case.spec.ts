import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { GetUserByIdUseCase } from './get-user-by-id.use-case'

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: UserRepository,
          useValue: {
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    getUserByIdUseCase = await module.get(GetUserByIdUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(getUserByIdUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get user', async () => {
      const userId = newObjectId()
      const fakeUser = createTestUser({
        id: userId
      })
      jest.spyOn(userRepository, 'getById').mockResolvedValue(fakeUser)
      const user = await getUserByIdUseCase.execute({ userId })
      expect(userRepository.getById).toHaveBeenCalledWith(userId, undefined)
      expect(user).toEqual(fakeUser)
    })
    it('should return null', async () => {
      const userId = newObjectId()
      jest.spyOn(userRepository, 'getById').mockResolvedValue(null)
      const user = await getUserByIdUseCase.execute({ userId })
      expect(userRepository.getById).toHaveBeenCalledWith(userId, undefined)
      expect(user).toEqual(null)
    })
  })
})
