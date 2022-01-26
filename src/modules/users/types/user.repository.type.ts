import { GoogleAuthSignUpDto, MsOfficeSignUpDto } from '../dto'

export interface CreateUserInput {
  outlookId?: string
  googleId?: string
  name: string
  email: string
  photoUrl?: string
  autoJoin: string
  timezone?: string
}

export interface AuthUserObject {
  accessToken: string
  refreshToken: string
  idToken?: string
  expiresAt: number
  scope?: string[]
  email?: string
  name?: string
  isGoogle: boolean
  isMsOffice: boolean
}

export interface AuthResponseFromGoogleMsObject {
  accessToken: string
  refreshToken: string
  expiresIn: string
  idToken: string
  scope?: string
}

export interface BaseAuthFlowUseCaseInput {
  signUpDto: GoogleAuthSignUpDto | MsOfficeSignUpDto
  identity: any
  authDto: AuthResponseFromGoogleMsObject
}

export interface ValidityAndProviderResponse {
  provider: string
  isValid: boolean
}
