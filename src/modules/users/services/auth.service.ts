import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TokenExpiredError } from 'jsonwebtoken'
import { JUser, TokenStatus } from '@common/types'
import { EventTYPE, USER_KEY } from '@common/constants'
import { InvalidTokenError } from '@common/errors'
import { UserCreatedEvent } from '@modules/users/events'
import { User, AuthResponse } from '../models'
import { GoogleAuthSignUpDto, MsOfficeSignUpDto } from '../dto'
import { SignUpGoogleAuthUseCase, SignUpOfficeAuthUseCase } from '../use-cases'

export interface GetUserFromTokenResponse {
  user: JUser | null
  tokenStatus: TokenStatus
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly signUpWithGoogleAuthCase: SignUpGoogleAuthUseCase,
    private readonly signupWithOfficeAuthCase: SignUpOfficeAuthUseCase,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createUserWithGoogleAuth(input: GoogleAuthSignUpDto): Promise<AuthResponse> {
    // get token from input and pass it to authService JWT Verifier
    const result = this.verifyRequestTokenFromAuthService(input.state)
    input.referral = (result.user && result.user.referral) || ''
    // run signup from google-auth usecase now..
    input.timezone = result.user?.timezone
    const userRecord: User = await this.signUpWithGoogleAuthCase.execute(input)
    // jwt sign token here
    const token = this.jwtService.sign({ id: userRecord.id })
    // dispatch an user event for the use-notes
    this.publishUserCreatedEvent(userRecord, token)

    return {
      user: userRecord,
      token
    }
  }

  async createUserWithMsOfficeAuth(input: MsOfficeSignUpDto): Promise<AuthResponse> {
    // get token from input and pass it to authService JWT Verifier
    const result = this.verifyRequestTokenFromAuthService(input.state)
    input.referral = (result.user && result.user.referral) || ''
    input.timezone = result.user?.timezone
    const userRecord: User = await this.signupWithOfficeAuthCase.execute(input)
    const token = this.jwtService.sign({ id: userRecord.id })
    this.publishUserCreatedEvent(userRecord, token)

    return {
      user: userRecord,
      token
    }
  }

  verifyToken(token: string | null): GetUserFromTokenResponse {
    if (!token) {
      return { user: null, tokenStatus: 'missing' }
    }

    try {
      const user = this.jwtService.verify(token)
      return { user, tokenStatus: 'valid' }
    } catch (err) {
      let tokenStatus: TokenStatus = 'invalid'
      if (err instanceof TokenExpiredError) {
        tokenStatus = 'expired'
      }
      return { user: null, tokenStatus }
    }
  }

  getUserConnection(authHeader: string | string[] | undefined): string | null {
    try {
      if (!authHeader) return null
      const token = this.getBearerToken(authHeader)
      return token ?? null
    } catch {
      return null
    }
  }

  getBearerToken(authHeader: string | string[]): string | undefined {
    return authHeader.toString().split('Bearer ')[1]
  }

  getTokenFromHeader(authHeader: string | string[] | undefined): GetUserFromTokenResponse {
    const token = this.getUserConnection(authHeader)
    return this.verifyToken(token)
  }

  getState(value: any): string {
    const response = this.jwtService.sign(value, { expiresIn: 300 })
    return response
  }

  private verifyRequestTokenFromAuthService(token: string): GetUserFromTokenResponse {
    const result = this.getTokenFromHeader(token)
    // sanity check
    if (result.tokenStatus !== 'valid') {
      // throw token validation error here
      throw new InvalidTokenError({ status: result.tokenStatus })
    }

    if (result.user?.key !== USER_KEY) {
      throw new InvalidTokenError({ status: 'invalid' })
    }
    return result
  }

  private publishUserCreatedEvent(user: User, token: string) {
    const event = new UserCreatedEvent(user, token)
    this.eventEmitter.emit(EventTYPE.USER_CREATED_EVENT, event)
  }
}
