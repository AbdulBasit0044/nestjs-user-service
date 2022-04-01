import { Test } from '@nestjs/testing'
import faker from 'faker'
import { getGoogleIdentity, getGoogleTokens } from '@modules/users/google-office-auth-functions'
import { GoogleAuthSignUpDto } from '@modules/users/dto'
import { SignUpGoogleAuthUseCase } from './signup-google-auth.use-case'
import { BaseAuthFlowUseCase } from './base-auth-flow.use-case'

const authObject: GoogleAuthSignUpDto = {
  code: faker.random.alphaNumeric(10),
  referral: '',
  scope: faker.random.alphaNumeric(40),
  state: faker.random.alphaNumeric(20)
}

const mockGoogleAuthValues = {
  accessToken: faker.random.alphaNumeric(20),
  refreshToken: faker.random.alphaNumeric(20),
  expiresIn: faker.random.alphaNumeric(20),
  idToken: faker.random.alphaNumeric(20)
}

const mockGoogleIdentityValues = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  picture: faker.internet.avatar()
}

jest.mock('@modules/users/google-office-auth-functions')

describe('signup-google-auth-usecase', () => {
  let usecase: SignUpGoogleAuthUseCase
  let baseUserAuthFlow: BaseAuthFlowUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignUpGoogleAuthUseCase,
        {
          provide: BaseAuthFlowUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(null)
          }
        }
      ]
    }).compile()
    usecase = await module.get(SignUpGoogleAuthUseCase)
    baseUserAuthFlow = await module.get(BaseAuthFlowUseCase)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(usecase).toBeDefined()
    expect(baseUserAuthFlow).toBeDefined()
  })

  it('should run execute function', async () => {
    jest.spyOn(baseUserAuthFlow, 'execute')

    const mockGoogleToken = getGoogleTokens as jest.MockedFunction<typeof getGoogleTokens>
    mockGoogleToken.mockResolvedValue(mockGoogleAuthValues)

    const mockGoogleIdentity = getGoogleIdentity as jest.MockedFunction<typeof getGoogleIdentity>
    mockGoogleIdentity.mockResolvedValue(mockGoogleIdentityValues)

    await usecase.execute(authObject)
    expect(getGoogleIdentity).toHaveBeenCalled()
    expect(getGoogleTokens).toHaveBeenCalled()
    expect(baseUserAuthFlow.execute).toBeCalled()
  })
})
