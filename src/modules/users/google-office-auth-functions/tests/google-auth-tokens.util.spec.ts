import faker from 'faker'
import nock from 'nock'
import { ThirdPartyServiceError } from '@common/errors'
import { getGoogleIdentity, getGoogleTokens } from '@modules/users/google-office-auth-functions'

describe('googleToken & identity TestSuite', () => {
  const fakeToken = faker.random.alphaNumeric(40)
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getGoogleTokens', () => {
    it('should nock google token api and sucess', async () => {
      nock('https://oauth2.googleapis.com').post('/token').reply(200, {})
      const result = await getGoogleTokens(fakeToken)
      expect(result).toBeTruthy()
    })

    it('should throw error', async () => {
      nock('https://oauth2.googleapis.com').post('/token').reply(200)
      await expect(getGoogleTokens(fakeToken)).rejects.toThrow(ThirdPartyServiceError)
    })
  })

  describe('getGoogleIdentity', () => {
    it('should nock google identity api and success', async () => {
      nock('https://www.googleapis.com/oauth2/v1').get('/userinfo').reply(200, {})
      const result = await getGoogleIdentity(fakeToken)
      expect(result).toBeTruthy()
    })
  })
})
