import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import faker from 'faker'
import { Model } from 'mongoose'
import { CreateUserInput, AuthUserObject } from '@modules/users/types'
import { User } from '@modules/users/models'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '../user.repository'

const user = createTestUser()

const createUserInput: CreateUserInput = {
  outlookId: user.outlookId,
  name: user.name,
  email: user.email,
  photoUrl: user.photoUrl as string,
  autoJoin: user.autoJoin
}

const authUserObject: AuthUserObject = {
  accessToken: faker.random.alphaNumeric(40),
  refreshToken: faker.random.alphaNumeric(40),
  expiresAt: new Date().getTime(),
  isGoogle: true,
  isMsOffice: false
}

describe('UserRepository', () => {
  let userRepository: UserRepository
  let userModel: Model<User>

  beforeAll(async () => {
    const modelToken = getModelToken(User.name)
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: modelToken,
          useValue: {
            create: jest.fn().mockResolvedValue(user),
            findOne: jest.fn(),
            exists: jest.fn(),
            getById: jest.fn()
          }
        }
      ]
    }).compile()

    userRepository = await module.get(UserRepository)
    userModel = await module.get(modelToken)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(userRepository).toBeDefined()
    expect(userModel).toBeDefined()
  })

  describe('create', () => {
    it('should create an user successfully', async () => {
      const response = await userRepository.create(createUserInput)
      expect(response).toMatchObject(user)
    })
  })

  describe('getByEmail', () => {
    it('should return null if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null)

      const response = await userRepository.getByEmail(faker.internet.email())
      expect(response).toBe(null)
    })
    it('should get the user successfully', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(user)

      const response = await userRepository.getByEmail(user.email)
      expect(response).toBeInstanceOf(User)
      expect(response?.email).toEqual(user.email)
    })
  })

  describe('existsByEmail', () => {
    it('should return false if user is not found', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false)

      const response = await userRepository.existsByEmail(faker.internet.email())
      expect(response).toBe(false)
    })
    it('should return true if the user exists', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true)

      const response = await userRepository.existsByEmail(user.email)
      expect(response).toBe(true)
    })
  })

  describe('createOrUpdateUser', () => {
    const fakeEmailAddress = faker.internet.email('jerry', 'sienfield')
    it('should create a new user on goole credentials', async () => {
      createUserInput.email = fakeEmailAddress
      const record = await userRepository.createOrUpdateUser(createUserInput, authUserObject)
      expect(record).toBeTruthy()
    })

    it('should update user with ms credentials', async () => {
      authUserObject.isGoogle = false
      authUserObject.isMsOffice = true
      const record = await userRepository.createOrUpdateUser(createUserInput, authUserObject)
      expect(record.email).toBeTruthy()
    })
  })
})
