import axios from 'axios'
import {
  GOOGLE_TOKEN_ENDPOINT,
  GOOGLE_CLIENT,
  GOOGLE_S,
  GOOGLE_IDENTITY_ENDPOINT,
  ROOT_URL
} from '@common/constants'
import { ThirdPartyServiceError } from '@common/errors'
import { AuthResponseFromGoogleMsObject, AuthUserObject } from '@modules/users/types'

export async function getGoogleTokens(code: string): Promise<AuthResponseFromGoogleMsObject> {
  const options = {
    code,
    client_id: GOOGLE_CLIENT,
    client_secret: GOOGLE_S,
    redirect_uri: `${ROOT_URL}auth/google`,
    grant_type: 'authorization_code'
  }
  let response
  try {
    response = await axios.post(GOOGLE_TOKEN_ENDPOINT, options)
  } catch {
    throw new ThirdPartyServiceError('googleAuthService')
  }

  // sanity check
  if (!response.data) {
    throw new ThirdPartyServiceError('googleAuthService')
  }

  const tokens: AuthResponseFromGoogleMsObject = {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
    idToken: response.data.id_token
  }
  return tokens
}

export async function getGoogleIdentity(accessToken: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
  const result = await axios.get(GOOGLE_IDENTITY_ENDPOINT, { headers })
  return result.data
}

export async function refreshGoogleToken(token: string): Promise<AuthUserObject> {
  const options = {
    refresh_token: token,
    client_id: GOOGLE_CLIENT,
    client_secret: GOOGLE_S,
    grant_type: 'refresh_token'
  }
  let response
  try {
    response = await axios.post(GOOGLE_TOKEN_ENDPOINT, options)
  } catch {
    throw new ThirdPartyServiceError('googleAuthService')
  }

  // sanity check
  if (!response.data) {
    throw new ThirdPartyServiceError('googleAuthService')
  }
  const auth: AuthUserObject = {
    accessToken: response.data.access_token,
    refreshToken: token,
    expiresAt: response.data.expires_in,
    idToken: response.data.id_token,
    isGoogle: true,
    isMsOffice: false
  }

  return auth
}
