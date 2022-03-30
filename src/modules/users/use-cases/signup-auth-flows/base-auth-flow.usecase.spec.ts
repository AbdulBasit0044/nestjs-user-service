import { Test } from '@nestjs/testing'
import faker from 'faker'
import { UserRepository } from '@modules/users/repositories'
import { BaseAuthFlowUseCase } from '@modules/users/use-cases'
import { BaseAuthFlowUseCaseInput } from '@modules/users/types'

const authDto = {
  accessToken: faker.random.alphaNumeric(40),
  expiresIn: new Date().getTime().toString(),
  idToken: faker.random.alphaNumeric(40),
  refreshToken: faker.random.alphaNumeric(40)
}

const identity = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  picture: faker.internet.avatar()
}

const signUpDto = {
  code: faker.random.alphaNumeric(40),
  scope: faker.random.alphaNumeric(40),
  state: faker.random.alphaNumeric(40),
  referral: '?t=auto&s=linkedin&u=haziq&t=ff'
}

const input: BaseAuthFlowUseCaseInput = {
  authDto,
  identity,
  signUpDto
}

describe('base-auth-flow-use-case', () => {
  let baseAuthFlow: BaseAuthFlowUseCase

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BaseAuthFlowUseCase,
        {
          provide: UserRepository,
          useValue: {
            createOrUpdateUser: jest.fn().mockResolvedValue(() => {
              return true
            })
          }
        }
      ]
    }).compile()

    baseAuthFlow = await module.get(BaseAuthFlowUseCase)
  })

  it('should create user with referal', async () => {
    const result = await baseAuthFlow.execute(input)
    expect(result).toBeTruthy()
  })

  it('should create user with out referal', async () => {
    const newSignUpDto = {
      code: faker.random.alphaNumeric(40),
      scope: faker.random.alphaNumeric(40),
      state: faker.random.alphaNumeric(40),
      referral: ''
    }
    const newInput: BaseAuthFlowUseCaseInput = {
      authDto,
      identity,
      signUpDto: newSignUpDto
    }
    const result = await baseAuthFlow.execute(newInput)
    expect(result).toBeTruthy()
  })
})
