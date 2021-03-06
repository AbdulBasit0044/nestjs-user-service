import { ExecutionContext } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Reflector } from '@nestjs/core'
import { createMock } from '@golevelup/nestjs-testing'
import faker from 'faker'
import { InvalidTokenError, UnauthenticatedError, ForbiddenError } from '@common/errors'
import { JUser, Role } from '@common/types'
import { TEST_ROLE } from '@common/test'
import { AuthGuard } from '../auth.guard'

describe('AuthGuard', () => {
  let guard: AuthGuard
  let reflector: Reflector

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthGuard]
    }).compile()

    guard = await module.get(AuthGuard)
    reflector = await module.get(Reflector)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
    expect(reflector).toBeDefined()
  })

  it('should throw an error if token is invalid', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          tokenStatus: 'invalid',
          user: null
        })
      })
    })

    expect(() => {
      guard.canActivate(context)
    }).toThrowError(InvalidTokenError)
  })

  it('should throw an error if user is not found', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: null
        })
      })
    })
    expect(() => {
      guard.canActivate(context)
    }).toThrowError(UnauthenticatedError)
  })

  it('should throw an error if token is missing', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          tokenStatus: 'missing'
        })
      })
    })
    expect(() => {
      guard.canActivate(context)
    }).toThrowError(UnauthenticatedError)
  })

  it('should throw an error if user doesnt have the right role', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            email: faker.internet.email(),
            role: TEST_ROLE
          } as JUser
        })
      })
    })
    jest.spyOn(reflector, 'get').mockReturnValue([Role.USER])
    expect(() => {
      guard.canActivate(context)
    }).toThrowError(ForbiddenError)
  })

  it('should return true with auth if no role was defined', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            email: faker.internet.email(),
            role: TEST_ROLE
          } as JUser
        })
      })
    })
    expect(guard.canActivate(context)).toBeTruthy()
  })

  it('should return true with auth specifying the role', () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            email: faker.internet.email(),
            role: Role.USER
          } as JUser
        })
      })
    })
    jest.spyOn(reflector, 'get').mockReturnValue([Role.USER])
    expect(guard.canActivate(context)).toBeTruthy()
  })
})
