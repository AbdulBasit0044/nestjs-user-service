import { Test } from '@nestjs/testing'
import faker from 'faker'
import { refreshGoogleToken } from '@modules/users/google-office-auth-functions'
import { RefreshGoogleTokenUseCase } from './refresh-google-token.use-case'

const mockRefreshTokenParams = {
  refreshToken: faker.random.alphaNumeric(20)
}

const mockGoogleAuthValues = {
  accessToken: faker.random.alphaNumeric(20),
  refreshToken: faker.random.alphaNumeric(20),
  expiresAt: 3600,
  idToken: faker.random.alphaNumeric(20),
  isGoogle: true,
  isMsOffice: false
}

jest.mock('@modules/users/google-office-auth-functions')

describe('refresh-google-token-usecase', () => {
  let usecase: RefreshGoogleTokenUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [RefreshGoogleTokenUseCase]
    }).compile()
    usecase = await module.get(RefreshGoogleTokenUseCase)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(usecase).toBeDefined()
  })

  it('should run execute function', async () => {
    const mockRefreshGoogleToken = refreshGoogleToken as jest.MockedFunction<
      typeof refreshGoogleToken
    >
    mockRefreshGoogleToken.mockResolvedValue(mockGoogleAuthValues)

    await usecase.execute(mockRefreshTokenParams)
    expect(mockRefreshGoogleToken).toHaveBeenCalled()
  })
})
