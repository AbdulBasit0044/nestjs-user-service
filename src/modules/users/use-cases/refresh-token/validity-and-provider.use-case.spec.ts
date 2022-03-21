import { Test } from '@nestjs/testing'
import faker from 'faker'
import { toTimestamp } from '@common/utils'
import { createTestUser } from '@modules/users/fixtures'
import { User } from '@modules/users/models'
import { ValidityAndProviderUseCase } from './validity-and-provider.use-case'

const userWithValidAuthInput = createTestUser({
  gauth: {
    access_token: faker.random.alphaNumeric(20),
    refresh_token: faker.random.alphaNumeric(20),
    expires_at: toTimestamp(3600),
    type: 'gauth',
    token_type: 'refresh_token',
    id_token: faker.random.alphaNumeric(20)
  }
})

const userWithInvalidAuthInput: User = createTestUser({
  gauth: {
    access_token: faker.random.alphaNumeric(20),
    refresh_token: faker.random.alphaNumeric(20),
    expires_at: 0,
    type: 'gauth',
    token_type: 'refresh_token',
    id_token: faker.random.alphaNumeric(20)
  }
})

const userInvalidAuthInput: User = createTestUser()

const userWithValidAuth = createTestUser(userWithValidAuthInput)
const userWithExpireToken = createTestUser(userWithInvalidAuthInput)
const userWithInvalidAuth = createTestUser(userInvalidAuthInput)

describe('ValidityAndProviderUseCase', () => {
  let validityAndProviderUseCase: ValidityAndProviderUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ValidityAndProviderUseCase,
        {
          provide: ValidityAndProviderUseCase,
          useClass: ValidityAndProviderUseCase
        }
      ]
    }).compile()
    validityAndProviderUseCase = await module.get(ValidityAndProviderUseCase)
  })

  it('should be defined', () => {
    expect(validityAndProviderUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should return isValid true and provider type', () => {
      const response = validityAndProviderUseCase.execute(userWithValidAuth)[0]
      expect(response).toHaveProperty('provider')
      expect(response).toHaveProperty('isValid')
      expect(response.provider).toEqual('gauth')
      expect(response.isValid).toBeTruthy()
    })
    it('should return isValid false and provider type', () => {
      const response = validityAndProviderUseCase.execute(userWithExpireToken)[0]
      expect(response).toHaveProperty('provider')
      expect(response).toHaveProperty('isValid')
      expect(response.provider).toEqual('gauth')
      expect(response.isValid).toBeFalsy()
    })
    it('should return isValid false and provider type blank', () => {
      const response = validityAndProviderUseCase.execute(userWithInvalidAuth)
      expect(response).toEqual([])
    })
  })
})
