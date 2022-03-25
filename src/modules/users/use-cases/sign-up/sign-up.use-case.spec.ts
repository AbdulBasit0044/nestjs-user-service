import { Test } from '@nestjs/testing'
import faker from 'faker'
import { ObjectAlreadyExistsError } from '@common/errors'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { SignUpUseCase, SignUpParams } from './sign-up.use-case'

const signUpInput: SignUpParams = {
  outlookId: faker.datatype.string(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  autoJoin: faker.name.findName()
}

const user = createTestUser(signUpInput)

describe('SignUpUseCase', () => {
  let signUpUseCase: SignUpUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
        {
          provide: UserRepository,
          useValue: {
            existsByEmail: jest.fn(),
            create: jest.fn()
          }
        }
      ]
    }).compile()

    signUpUseCase = await module.get(SignUpUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(signUpUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should throw an error if already exists an user with the email', async () => {
      jest.spyOn(userRepository, 'existsByEmail').mockResolvedValueOnce(true)
      jest.spyOn(userRepository, 'create')

      const promise = signUpUseCase.execute(signUpInput)
      await expect(promise).rejects.toThrow(ObjectAlreadyExistsError)
      await expect(promise).rejects.toHaveProperty('metadata.field', 'email')
      await expect(promise).rejects.toHaveProperty('metadata.objectType', 'User')
      expect(userRepository.existsByEmail).toBeCalledWith(signUpInput.email)
      expect(userRepository.create).not.toBeCalled()
    })
    it('should create an user successfully', async () => {
      jest.spyOn(userRepository, 'existsByEmail').mockResolvedValueOnce(false)
      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(user)

      const response = await signUpUseCase.execute(signUpInput)
      expect(response).toMatchObject(user)
    })
  })
})
