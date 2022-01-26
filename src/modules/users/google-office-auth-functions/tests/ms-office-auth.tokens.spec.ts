import faker from 'faker'
import nock from 'nock'
import { ThirdPartyServiceError } from '@common/errors'
import { OFFICE_CLIENT, OFFICE_CLIENT_S, ROOT_URL } from '@common/constants'
import {
  getOffice365Tokens,
  getOffice365Identity
} from '@modules/users/google-office-auth-functions'

describe('ms-offfice & identity TestSuite', () => {
  const fakeToken = faker.random.alphaNumeric(40)
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getOffice365Tokens', () => {
    it('should nock ms-offfice token api and sucess', async () => {
      const options = {
        code: fakeToken,
        client_id: OFFICE_CLIENT,
        client_secret: encodeURI(OFFICE_CLIENT_S),
        redirect_uri: `${ROOT_URL}auth/outlook`,
        grant_type: 'authorization_code'
      }
      nock('https://login.microsoftonline.com/common/oauth2/v2.0')
        .post('/token', options)
        .reply(200, {})
      const result = await getOffice365Tokens(fakeToken)
      expect(result).toBeTruthy()
    })

    it('should throw error on 500', async () => {
      nock('https://login.microsoftonline.com/common/oauth2/v2.0').get('/token').reply(500)
      await expect(getOffice365Tokens(fakeToken)).rejects.toThrow(ThirdPartyServiceError)
    })

    it('should throw error', async () => {
      nock('https://login.microsoftonline.com/common/oauth2/v2.0').get('/token').reply(200)
      await expect(getOffice365Tokens(fakeToken)).rejects.toThrow(ThirdPartyServiceError)
    })
  })

  describe('getOffice365Identity', () => {
    it('should nock ms-office identity api and success', async () => {
      nock('https://graph.microsoft.com/v1.0').get('/me').reply(200, {})
      const result = await getOffice365Identity(fakeToken)
      expect(result).toBeTruthy()
    })
  })
})
