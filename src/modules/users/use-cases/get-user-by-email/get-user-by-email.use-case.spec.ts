import { Test } from '@nestjs/testing'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { GetUserByEmailUseCase } from './get-user-by-email.use-case'

describe('GetUserByEmailUseCase', () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByEmailUseCase,
        {
          provide: UserRepository,
          useValue: {
            getByEmail: jest.fn()
          }
        }
      ]
    }).compile()

    getUserByEmailUseCase = await module.get(GetUserByEmailUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(getUserByEmailUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get user', async () => {
      const email = 'dummy@example.com'
      const fakeUser = createTestUser({
        email
      })
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(fakeUser)
      const user = await getUserByEmailUseCase.execute({ email })
      expect(userRepository.getByEmail).toHaveBeenCalledWith(email, undefined)
      expect(user).toEqual(fakeUser)
    })
    it('should return null', async () => {
      const email = 'dummy@example.com'
      jest.spyOn(userRepository, 'getByEmail').mockResolvedValue(null)
      const user = await getUserByEmailUseCase.execute({ email })
      expect(userRepository.getByEmail).toHaveBeenCalledWith(email, undefined)
      expect(user).toEqual(null)
    })
  })
})
