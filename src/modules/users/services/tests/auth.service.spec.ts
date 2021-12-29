import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { EventEmitter2 } from '@nestjs/event-emitter'
import faker from 'faker'
import nock from 'nock'
import jwt from 'jsonwebtoken'
import { Role } from '@common/types'
import { TOKEN_VERIFIER, USER_KEY } from '@common/constants'
import { InvalidTokenError } from '@common/errors'
import { createTestUser } from '@modules/users/fixtures'
import { jwtModule } from '@modules/global-configs'
import { SignUpOfficeAuthUseCase, SignUpGoogleAuthUseCase } from '@modules/users/use-cases'
import { GoogleAuthSignUpDto, MsOfficeSignUpDto } from '@modules/users/dto'
import { AuthService } from '../auth.service'

const userTest = createTestUser()

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [
        AuthService,
        {
          provide: SignUpGoogleAuthUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(userTest)
          }
        },
        {
          provide: SignUpOfficeAuthUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(userTest)
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emait: jest.fn().mockResolvedValue(userTest)
          }
        }
      ]
    }).compile()

    authService = await module.get(AuthService)
    jwtService = await module.get(JwtService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
    expect(jwtService).toBeDefined()
  })

  describe('verifyToken', () => {
    it('should return tokenStatus invalid with no user', () => {
      const token = null
      const { tokenStatus, user } = authService.verifyToken(token)
      expect(tokenStatus).toBe('missing')
      expect(user).toBe(null)
    })
    it('should return tokenStatus invalid', () => {
      const token = 'anytoken'
      const { tokenStatus, user } = authService.verifyToken(token)
      expect(tokenStatus).toBe('invalid')
      expect(user).toBe(null)
    })
    it('should return tokenStatus expired', () => {
      const user = createTestUser()
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: Role.USER,
          exp: faker.date.past().getTime() / 1000
        },
        TOKEN_VERIFIER
      )
      const { tokenStatus, user: resUser } = authService.verifyToken(token)
      expect(tokenStatus).toBe('expired')
      expect(resUser).toBe(null)
    })
  })

  describe('getUserConnection', () => {
    it('should return null if token invalid', () => {
      const token = authService.getUserConnection('anything')
      expect(token).toBe(null)
    })
    it('should return null if no token is passed', () => {
      jest.spyOn(authService, 'getBearerToken')
      const token = authService.getUserConnection(undefined)
      expect(authService.getBearerToken).toBeCalledTimes(0)
      expect(token).toBe(null)
    })
    it('should return null if getBearerToken fails', () => {
      jest.spyOn(authService, 'getBearerToken').mockImplementation(() => {
        throw new Error('generic error')
      })
      const token = authService.getUserConnection('something')
      expect(authService.getBearerToken).toThrowError()
      expect(token).toBe(null)
    })
    it('should return the token', () => {
      const token = authService.getBearerToken('Bearer something')
      expect(token).toBe('something')
    })
  })

  describe('getBearerToken', () => {
    it('should return undefined if wasnt able to get the token', () => {
      jest.spyOn(authService, 'getBearerToken')
      const response = authService.getBearerToken('anything')
      expect(response).toBeUndefined()
    })
    it('should return the token', () => {
      const token = authService.getBearerToken('Bearer something')
      expect(token).toBe('something')
    })
  })

  describe('getTokenFromHeader', () => {
    it('should return the payload from header', () => {
      const user = createTestUser()
      const token = jwtService.sign({ sub: user.id, role: Role.USER })
      const res = authService.getTokenFromHeader(`Bearer ${token}`)
      expect(res.user).toBeTruthy()
      expect(res.tokenStatus).toBe('valid')
    })
    it('should not return a successful payload', () => {
      const res = authService.getTokenFromHeader('any')
      expect(res).toEqual({ user: null, tokenStatus: 'missing' })
    })
    it('should return tokenStatus invalid', () => {
      const res = authService.getTokenFromHeader('Bearer something')
      expect(res).toEqual({ user: null, tokenStatus: 'invalid' })
    })
  })

  describe('createUserWithGoogleAuth', () => {
    const input: GoogleAuthSignUpDto = {
      code: faker.random.alphaNumeric(40),
      scope: faker.random.alphaNumeric(40),
      state: jwt.sign('silly_code', TOKEN_VERIFIER)
    }

    it('should throw back invalid token error', async () => {
      await expect(authService.createUserWithGoogleAuth(input)).rejects.toThrow(InvalidTokenError)
    })

    it('shuold create user with google credentials', async () => {
      const value = { key: USER_KEY }
      const newInput: GoogleAuthSignUpDto = {
        code: faker.random.alphaNumeric(40),
        scope: faker.random.alphaNumeric(40),
        state: `Bearer ${jwt.sign(value, TOKEN_VERIFIER)}`
      }
      const tokens = {
        accessToken: faker.random.alphaNumeric(50),
        refreshToken: faker.random.alphaNumeric(50),
        idToken: faker.random.alphaNumeric(50),
        expiresIn: new Date().getTime().toString()
      }
      const identity = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        picture: faker.internet.avatar()
      }

      // mock third part calls and use-notes call back
      nock('https://oauth2.googleapis.com').post('/token').reply(200, tokens)
      nock('https://www.googleapis.com/oauth2/v1').get('/userinfo').reply(200, identity)
      nock('http://localhost:4000/auth').post('/notes/callback').reply(200, { status: 'ok' })

      const publishUserCreatedEvent = jest.spyOn(
        AuthService.prototype as any,
        'publishUserCreatedEvent'
      )
      publishUserCreatedEvent.mockImplementation(() => {
        return true
      })
      const result = await authService.createUserWithGoogleAuth(newInput)
      expect(result).toBeTruthy()
    })
  })

  describe('createUserWithMsOfficeAuth', () => {
    const input: MsOfficeSignUpDto = {
      code: faker.random.alphaNumeric(40),
      scope: faker.random.alphaNumeric(40),
      state: jwt.sign('silly_code', TOKEN_VERIFIER)
    }

    it('should throw back invalid token error', async () => {
      await expect(authService.createUserWithGoogleAuth(input)).rejects.toThrow(InvalidTokenError)
    })

    it('shuold create user with ms-office credentials', async () => {
      const value = { key: USER_KEY }
      const newInput: MsOfficeSignUpDto = {
        code: faker.random.alphaNumeric(40),
        scope: faker.random.alphaNumeric(40),
        state: `Bearer ${jwt.sign(value, TOKEN_VERIFIER)}`
      }
      const tokens = {
        accessToken: faker.random.alphaNumeric(50),
        refreshToken: faker.random.alphaNumeric(50),
        idToken: faker.random.alphaNumeric(50),
        expiresIn: new Date().getTime().toString()
      }
      const identity = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        picture: faker.internet.avatar()
      }

      // mock third part calls and use-notes call back
      nock('https://login.microsoftonline.com/common/oauth2/v2.0').get('/token').reply(200, tokens)
      nock('https://graph.microsoft.com/v1.0').get('/me').reply(200, identity)
      nock('http://localhost:4000/auth').post('/notes/callback').reply(200, { status: 'ok' })

      const publishUserCreatedEvent = jest.spyOn(
        AuthService.prototype as any,
        'publishUserCreatedEvent'
      )
      publishUserCreatedEvent.mockImplementation(() => {
        return true
      })
      const result = await authService.createUserWithMsOfficeAuth(newInput)
      expect(result).toBeTruthy()
    })
  })
})
