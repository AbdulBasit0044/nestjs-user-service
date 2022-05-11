import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import supertest from 'supertest'
import faker from 'faker'
import nock from 'nock'
import { USER_KEY } from '@common/constants'
import { PubSubService } from '@modules/global-configs/services'
import { GoogleAuthSignUpDto, MsOfficeSignUpDto } from '@modules/users/dto'
import {
  getGoogleIdentity,
  getGoogleTokens,
  getOffice365Identity,
  getOffice365Tokens
} from '@modules/users/google-office-auth-functions'
import { AppModule } from '../src/app.module'

jest.mock('@modules/users/google-office-auth-functions')

const tokens = {
  accessToken: faker.random.alphaNumeric(50),
  refreshToken: faker.random.alphaNumeric(50),
  idToken: faker.random.alphaNumeric(50),
  expiresIn: new Date().getTime().toString()
}
const identity = {
  userId: faker.datatype.string(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  picture: faker.internet.avatar()
}

const params = {
  value: USER_KEY
}

describe('auth resolver (e2e', () => {
  let app: INestApplication
  let signedJWTToken: string
  let request: () => supertest.SuperTest<supertest.Test>

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(PubSubService)
      .useValue({
        sendMessageToTopic: jest.fn().mockResolvedValue(() => {
          return true
        })
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.startAllMicroservices()
    await app.init()
    request = () => supertest(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe('getState', () => {
    it('should return valid JWT verified token', () => {
      return request()
        .get('/auth/state/jwt')
        .query(params)
        .expect(200)
        .expect(res => {
          signedJWTToken = res.body.data
          expect(res.body.data).toBeTruthy()
        })
    })
  })

  describe('createUserWithGoogle', () => {
    const url = '/auth/google'
    const dtoInput: GoogleAuthSignUpDto = {
      code: '',
      scope: '',
      state: signedJWTToken
    }
    it('should throw bad request', () => {
      return request().get(url).query(dtoInput).expect(400)
    })

    it('should create a user', async () => {
      const newInput: GoogleAuthSignUpDto = {
        code: faker.random.alphaNumeric(50),
        scope: faker.random.alphaNumeric(50),
        state: `Bearer ${signedJWTToken}`
      }
      nock('https://oauth2.googleapis.com').post('/token').reply(200, tokens)
      nock('https://www.googleapis.com/oauth2/v1').get('/userinfo').reply(200, identity)
      const mockGoogleToken = getGoogleTokens as jest.MockedFunction<typeof getGoogleTokens>
      mockGoogleToken.mockResolvedValue(tokens)

      const mockGoogleIdentity = getGoogleIdentity as jest.MockedFunction<typeof getGoogleIdentity>
      mockGoogleIdentity.mockResolvedValue(identity)
      return request().get(url).query(newInput).expect(302)
    })
  })

  describe('createUserWithOffice', () => {
    const url = '/auth/office365'
    const dtoInput: MsOfficeSignUpDto = {
      code: '',
      scope: '',
      state: signedJWTToken
    }
    it('should throw bad request', () => {
      return request().post(url).send(dtoInput).expect(400)
    })

    it('should create a user', async () => {
      const newInput: MsOfficeSignUpDto = {
        code: faker.random.alphaNumeric(50),
        scope: faker.random.alphaNumeric(50),
        state: `Bearer ${signedJWTToken}`
      }
      nock('https://oauth2.googleapis.com').post('/token').reply(200, tokens)
      nock('https://www.googleapis.com/oauth2/v1').get('/userinfo').reply(200, identity)
      const mockOfficeToken = getOffice365Tokens as jest.MockedFunction<typeof getOffice365Tokens>
      mockOfficeToken.mockResolvedValue(tokens)

      const mockOfficeIdentity = getOffice365Identity as jest.MockedFunction<
        typeof getOffice365Identity
      >
      mockOfficeIdentity.mockResolvedValue(identity)
      return request().post(url).send(newInput).expect(201)
    })
  })
})
