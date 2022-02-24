import { Test } from '@nestjs/testing'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { GetUsersByEmailUseCase } from './get-users-by-email.use-case'

describe('GetUsersByEmailUseCase', () => {
  let getUsersByEmailUseCase: GetUsersByEmailUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUsersByEmailUseCase,
        {
          provide: UserRepository,
          useValue: {
            getByEmails: jest.fn()
          }
        }
      ]
    }).compile()

    getUsersByEmailUseCase = await module.get(GetUsersByEmailUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(getUsersByEmailUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get multiple users without select', async () => {
      const email = 'dummy4@example.com'
      const fakeUser1 = createTestUser({
        email
      })
      const email2 = 'dummy6@example.com'
      const fakeUser2 = createTestUser({
        email: email2
      })
      jest.spyOn(userRepository, 'getByEmails').mockResolvedValue([fakeUser1, fakeUser2])
      const emails = [email, email2]
      const users = await getUsersByEmailUseCase.execute({ emails })
      expect(userRepository.getByEmails).toHaveBeenCalledWith(emails, undefined)
      expect(users[0]).toEqual(fakeUser1)
    })

    it('should get multiple users with select', async () => {
      const email = 'dummy@example.com'
      const fakeUser1 = createTestUser({
        email
      })
      const email2 = 'dummy2@example.com'
      const fakeUser2 = createTestUser({
        email: email2
      })
      jest.spyOn(userRepository, 'getByEmails').mockResolvedValue([fakeUser1, fakeUser2])
      const emails = [email, email2]
      const users = await getUsersByEmailUseCase.execute({ emails, select: ['email'] })
      expect(userRepository.getByEmails).toHaveBeenCalledWith(emails, ['email'])
      expect(users[0]).toEqual(fakeUser1)
    })
    it('should return empty array', async () => {
      const emails = ['jonhsjon@hsga.com']
      jest.spyOn(userRepository, 'getByEmails').mockResolvedValue([])
      const users = await getUsersByEmailUseCase.execute({ emails })
      expect(userRepository.getByEmails).toHaveBeenCalledWith(emails, undefined)
      expect(users).toEqual([])
    })
  })
})
