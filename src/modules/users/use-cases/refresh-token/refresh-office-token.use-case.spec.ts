import { Test } from '@nestjs/testing'
import faker from 'faker'
import { refreshOfficeToken } from '@modules/users/google-office-auth-functions'
import { RefreshOfficeTokenUseCase } from './refresh-office-token.use-case'

const mockRefreshTokenParams = {
  refreshToken: faker.random.alphaNumeric(20)
}

const mockOfficeAuthValues = {
  accessToken: faker.random.alphaNumeric(20),
  refreshToken: faker.random.alphaNumeric(20),
  expiresAt: 3600,
  idToken: faker.random.alphaNumeric(20),
  isGoogle: true,
  isMsOffice: false
}

jest.mock('@modules/users/google-office-auth-functions')

describe('refresh-office-token-usecase', () => {
  let usecase: RefreshOfficeTokenUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RefreshOfficeTokenUseCase]
    }).compile()
    usecase = await module.get(RefreshOfficeTokenUseCase)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(usecase).toBeDefined()
  })

  it('should run execute function', async () => {
    const mockRefreshOfficeToken = refreshOfficeToken as jest.MockedFunction<
      typeof refreshOfficeToken
    >
    mockRefreshOfficeToken.mockResolvedValue(mockOfficeAuthValues)

    await usecase.execute(mockRefreshTokenParams)
    expect(mockRefreshOfficeToken).toHaveBeenCalled()
  })
})
