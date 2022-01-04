import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'
import * as queryString from 'query-string'
import { Response } from 'express'
import {
  ROOT_URL,
  USER_KEY,
  GOOGLE_CLIENT,
  GOOGLE_AUTH_SCOPE,
  GOOGLE_AUTH_CALLBACK,
  GOOGLE_AUTH_ENDPOINT,
  OFFICE_CLIENT,
  OFFICE_365_OAUTH_SCOPE,
  OFFICE_AUTH_CALLBACK,
  OFFICE_AUTH_ENDPOINT,
  USE_NOTES_REGISTER_SUCCESS_CALL_BACK_URL
} from '@common/constants'
import { AuthService } from '../services'
import { GoogleAuthSignUpDto, MsOfficeSignUpDto, AuthRegistrationDto } from '../dto'
import { AuthResponse } from '../models'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signup/google')
  googleConsentScreen(@Query() input: AuthRegistrationDto, @Res() res: Response) {
    const { timezone = null } = input
    const jwtPayload = timezone ? { key: USER_KEY, timezone } : { key: USER_KEY }
    const params = {
      client_id: GOOGLE_CLIENT,
      redirect_uri: `${ROOT_URL}${GOOGLE_AUTH_CALLBACK}`,
      scope: GOOGLE_AUTH_SCOPE,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      hd: '*',
      state: `Bearer ${this.authService.getState(jwtPayload)}`
    }
    const queryParams = queryString.stringify(params)
    const googleLoginUrl = `${GOOGLE_AUTH_ENDPOINT}?${queryParams}`
    return res.redirect(googleLoginUrl)
  }

  @Get('google')
  @ApiCreatedResponse({
    type: AuthResponse,
    description: 'create user using google auth'
  })
  async createUserWithGoogle(@Query() input: GoogleAuthSignUpDto, @Res() res: Response) {
    const record = await this.authService.createUserWithGoogleAuth(input)
    const params = queryString.stringify({ userId: record.user.id })
    return res.redirect(`${USE_NOTES_REGISTER_SUCCESS_CALL_BACK_URL}?${params}`)
  }

  @Get('welcome/user')
  useNotesRegistrationSucessArbituaryUrlCallBack(@Query() values: Record<string, unknown>) {
    return values
  }

  @Post('office365')
  @ApiCreatedResponse({
    type: AuthResponse,
    description: 'create user using ms-office auth'
  })
  createUsersWithMsOffice(@Body() input: MsOfficeSignUpDto) {
    return this.authService.createUserWithMsOfficeAuth(input)
  }

  @Get('state/jwt')
  getState(@Query('value') key: string) {
    const validator = { key }
    const response = this.authService.getState(validator)
    return response
  }

  @Get('signup/outlook')
  outlookConsentScreen(@Query() input: AuthRegistrationDto, @Res() res: Response) {
    const { timezone = null } = input
    const jwtPayload = timezone ? { key: USER_KEY, timezone } : { key: USER_KEY }
    const query = {
      client_id: OFFICE_CLIENT,
      response_type: 'code',
      scope: OFFICE_365_OAUTH_SCOPE,
      redirect_uri: `${ROOT_URL}${OFFICE_AUTH_CALLBACK}`,
      prompt: 'consent',
      response_mode: 'query',
      access_type: 'offline',
      hd: '*',
      state: `Bearer ${this.authService.getState(jwtPayload)}`
    }
    const outlookLoginUrl = `${OFFICE_AUTH_ENDPOINT}?${queryString.stringify(query)}`
    return res.redirect(outlookLoginUrl)
  }

  @Get('outlook')
  @ApiCreatedResponse({
    type: AuthResponse,
    description: 'create user using outlook auth'
  })
  async createUserWithOutlook(@Query() input: MsOfficeSignUpDto, @Res() res: Response) {
    const record = await this.authService.createUserWithMsOfficeAuth(input)
    const params = queryString.stringify({ userId: record.user.id })
    return res.redirect(`${USE_NOTES_REGISTER_SUCCESS_CALL_BACK_URL}?${params}`)
  }
}
