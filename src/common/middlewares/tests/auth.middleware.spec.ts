import { Test } from '@nestjs/testing'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { createMock } from '@golevelup/nestjs-testing'
import { Response } from 'express'
import { Request, Role } from '@common/types'
import { AUTH_HEADER } from '@common/constants'
import { jwtModule } from '@modules/global-configs'
import { AuthService } from '@modules/users/services'
import { SignUpOfficeAuthUseCase, SignUpGoogleAuthUseCase } from '@modules/users/use-cases'
import { createTestUser } from '@modules/users/fixtures'
import { AuthMiddleware } from '../auth.middleware'

const userTest = createTestUser()

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let authService: AuthService
  let jwtService: JwtService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      providers: [
        AuthMiddleware,
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
            execute: jest.fn().mockResolvedValue(userTest)
          }
        }
      ]
    }).compile()

    authMiddleware = await module.get(AuthMiddleware)
    authService = await module.get(AuthService)
    jwtService = await module.get(JwtService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined()
    expect(authService).toBeDefined()
  })

  describe('use', () => {
    it('should define user and tokenStatus in request', () => {
      const user = createTestUser()
      const token = jwtService.sign({ sub: user.id, role: Role.USER })

      const req = createMock<Request>({
        headers: {
          [AUTH_HEADER]: `Bearer ${token}`
        }
      })
      const res = createMock<Response>()
      const next = jest.fn()

      authMiddleware.use(req, res, next)

      expect(req.tokenStatus).toBeDefined()
      expect(req.user).toBeDefined()
      expect(next).toBeCalled()
    })
  })
})
