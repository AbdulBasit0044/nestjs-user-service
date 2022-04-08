import { Test } from '@nestjs/testing'
import faker from 'faker'
import {
  getOffice365Identity,
  getOffice365Tokens
} from '@modules/users/google-office-auth-functions'
import { MsOfficeSignUpDto } from '@modules/users/dto'
import { SignUpOfficeAuthUseCase } from './signup-office-auth.use-case'
import { BaseAuthFlowUseCase } from './base-auth-flow.use-case'

const authObject: MsOfficeSignUpDto = {
  code: faker.random.alphaNumeric(10),
  referral: '',
  scope: faker.random.alphaNumeric(40),
  state: faker.random.alphaNumeric(20)
}

const mockOfficeAuthValues = {
  accessToken: faker.random.alphaNumeric(20),
  refreshToken: faker.random.alphaNumeric(20),
  expiresIn: faker.random.alphaNumeric(20),
  idToken: faker.random.alphaNumeric(20)
}

const mockOfficeIdentityValues = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  picture: faker.internet.avatar()
}

jest.mock('@modules/users/google-office-auth-functions')

describe('signup-office-auth-usecase', () => {
  let usecase: SignUpOfficeAuthUseCase
  let baseUserAuthFlow: BaseAuthFlowUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignUpOfficeAuthUseCase,
        {
          provide: BaseAuthFlowUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(null)
          }
        }
      ]
    }).compile()
    usecase = await module.get(SignUpOfficeAuthUseCase)
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

    const mockOfficeToken = getOffice365Tokens as jest.MockedFunction<typeof getOffice365Tokens>
    mockOfficeToken.mockResolvedValue(mockOfficeAuthValues)

    const mockOfficeIdentity = getOffice365Identity as jest.MockedFunction<
      typeof getOffice365Identity
    >
    mockOfficeIdentity.mockResolvedValue(mockOfficeIdentityValues)

    await usecase.execute(authObject)
    expect(getOffice365Identity).toHaveBeenCalled()
    expect(getOffice365Tokens).toHaveBeenCalled()
    expect(baseUserAuthFlow.execute).toBeCalled()
  })
})
