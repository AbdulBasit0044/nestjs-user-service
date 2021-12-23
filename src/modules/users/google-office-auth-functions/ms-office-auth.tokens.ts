import qs from 'qs'
import axios from 'axios'
import _ from 'lodash'
import * as queryString from 'query-string'
import {
  OFFICE_CLIENT,
  OFFICE_CLIENT_S,
  OFFICE_365_OAUTH_SCOPE,
  ROOT_URL,
  OFFICE_TOKEN_ENDPOINT,
  OFFICE_IDENTITY_ENDPOINT
} from '@common/constants'
import { ThirdPartyServiceError } from '@common/errors'
import { AuthResponseFromGoogleMsObject, AuthUserObject } from '@modules/users/types'

export async function getOffice365Tokens(code: string): Promise<AuthResponseFromGoogleMsObject> {
  const data = queryString.stringify({
    grant_type: 'authorization_code',
    code,
    client_id: OFFICE_CLIENT,
    client_secret: OFFICE_CLIENT_S,
    redirect_uri: `${ROOT_URL}auth/outlook`
  })
  let tokenResponse

  try {
    tokenResponse = await axios.post(OFFICE_TOKEN_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  } catch (err) {
    throw new ThirdPartyServiceError('officeAuthService')
  }

  if (!tokenResponse.data) {
    throw new ThirdPartyServiceError('officeAuthService')
  }
  const tokens: AuthResponseFromGoogleMsObject = {
    accessToken: tokenResponse.data.access_token,
    refreshToken: tokenResponse.data.refresh_token,
    expiresIn: tokenResponse.data.expires_in,
    idToken: tokenResponse.data.id_token,
    scope: OFFICE_365_OAUTH_SCOPE
  }
  return tokens
}

export async function getOffice365Identity(accessToken: string): Promise<any> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
  const result = await axios.get(OFFICE_IDENTITY_ENDPOINT, { headers })
  return result.data
}

export async function refreshOfficeToken(token: string): Promise<AuthUserObject> {
  const data = {
    client_id: OFFICE_CLIENT,
    client_secret: OFFICE_CLIENT_S,
    scope: OFFICE_365_OAUTH_SCOPE,
    grant_type: 'refresh_token',
    refresh_token: token
  }
  let response
  try {
    response = await axios.post(OFFICE_TOKEN_ENDPOINT, qs.stringify(data))
  } catch (e) {
    throw new ThirdPartyServiceError('officeAuthService')
  }
  // sanity check
  if (!response.data) {
    throw new ThirdPartyServiceError('officeAuthService')
  }
  const auth: AuthUserObject = {
    accessToken: response.data.access_token,
    refreshToken: token,
    expiresAt: response.data.expires_in,
    idToken: response.data.id_token,
    isGoogle: false,
    isMsOffice: true
  }

  return auth
}
