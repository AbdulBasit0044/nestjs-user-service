import { join } from 'path'
import { CanActivate, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import * as GRPC from '@grpc/grpc-js'
import * as ProtoLoader from '@grpc/proto-loader'
import faker from 'faker'
import { Model } from 'mongoose'
import { AclGuard } from '@common/guards/acl.guard'
import { newObjectId } from '@common/utils'
import { User } from '@modules/users/models'
import { PubSubService } from '@modules/global-configs/services'
import { getGrpcOptions } from '@modules/grpc'
import { AppModule } from '../src/app.module'

const signUpInput = {
  outlookId: faker.datatype.string(),
  name: 'Test User # 1',
  email: faker.internet.email(),
  autoJoin: 'manual'
}

describe('UserResolver (e2e)', () => {
  let app: INestApplication
  let createdUser: User
  let client: any
  let UserModel: Model<User>

  beforeAll(async () => {
    const mockForceFailGuard: CanActivate = { canActivate: jest.fn(() => true) }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(AclGuard)
      .useValue(mockForceFailGuard)
      .overrideProvider(PubSubService)
      .useValue({
        sendMessageToTopic: jest.fn().mockResolvedValue(() => {
          return true
        })
      })
      .compile()

    app = moduleFixture.createNestApplication()
    app.connectMicroservice(getGrpcOptions('localhost:5000'))
    await app.startAllMicroservices()
    await app.init()
    UserModel = await app.get(getModelToken(User.name))
    const proto = ProtoLoader.loadSync(
      join(__dirname, '../src/modules/grpc/user/proto/user.proto')
    ) as any

    const protoGRPC = GRPC.loadPackageDefinition(proto) as any

    client = new protoGRPC.user.UserGrpcService('localhost:5000', GRPC.credentials.createInsecure())
    createdUser = await UserModel.create(signUpInput)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('getUserById - grpc', () => {
    it('should get user', () => {
      return new Promise<void>(resolve => {
        client.getUserById({ id: createdUser.id }, (_err, response) => {
          expect(response.data.id).toEqual(createdUser.id)
          resolve()
        })
      })
    })
    it('should return object not found error', () => {
      return new Promise<void>(resolve => {
        client.getUserById({ id: faker.datatype.uuid() }, (_err, _response) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toEqual('Could not resolve one or more User using its id')
          resolve()
        })
      })
    })
  })

  describe('getUsersById - grpc', () => {
    it('should get users', () => {
      return new Promise<void>(resolve => {
        client.getUsersById({ ids: [createdUser.id] }, (_err, response) => {
          expect(response.data[0].id).toEqual(createdUser.id)
          resolve()
        })
      })
    })
    it('should return empty array. Protobuf will return as undefined', () => {
      return new Promise<void>(resolve => {
        client.getUsersById({ ids: [faker.datatype.uuid()] }, (_err, response) => {
          expect(response.data).toBe(undefined)
          resolve()
        })
      })
    })
  })

  describe('getUsersByemail - grpc', () => {
    it('should get users', () => {
      return new Promise<void>(resolve => {
        client.getUsersByEmail({ emails: [createdUser.email] }, (_err, response) => {
          expect(response.data[0].id).toEqual(createdUser.id)
          resolve()
        })
      })
    })
    it('should return empty array. Protobuf will return as undefined', () => {
      return new Promise<void>(resolve => {
        client.getUsersByEmail({ emails: [faker.datatype.uuid()] }, (_err, response) => {
          expect(response.data).toBe(undefined)
          resolve()
        })
      })
    })
  })

  describe('update user - grpc', () => {
    it('should be able to update user name user', () => {
      return new Promise<void>(resolve => {
        const name = 'updated-name'
        client.updateUser({ id: createdUser.id, data: { name } }, (_err, response) => {
          expect(response.data.name).toEqual(name)
          resolve()
        })
      })
    })
    it('should throw an error if trying to update profileUrl with non-url data', () => {
      return new Promise<void>(resolve => {
        const photoUrl = 'updated-url'
        client.updateUser({ id: createdUser.id, data: { photoUrl } }, (_err, _response: any) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toEqual(`Invalid argument(s) were provided`)
          resolve()
        })
      })
    })
    it('should update profileUrl correctly if provided a valid URL', () => {
      return new Promise<void>(resolve => {
        const photoUrl = faker.internet.avatar()
        client.updateUser({ id: createdUser.id, data: { photoUrl } }, (_err, response: any) => {
          expect(response.data.photoUrl).toEqual(photoUrl)
          resolve()
        })
      })
    })
    it('should throw error if trying to pass invalid timezone argument', () => {
      return new Promise<void>(resolve => {
        const timezone = faker.address.secondaryAddress()
        client.updateUser({ id: createdUser.id, data: { timezone } }, (_err, _response: any) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toEqual(`Invalid argument(s) were provided`)
          resolve()
        })
      })
    })
    it('should update timezone correctly', () => {
      return new Promise<void>(resolve => {
        const timezone = faker.address.timeZone()
        client.updateUser({ id: createdUser.id, data: { timezone } }, (_err, response: any) => {
          expect(response.data.timezone).toEqual(timezone)
          resolve()
        })
      })
    })
    it('should throw error if object not found error', () => {
      return new Promise<void>(resolve => {
        client.updateUser({ id: faker.datatype.uuid(), data: {} }, (_err, _response) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toBe('Could not resolve one or more User using its id')
          resolve()
        })
      })
    })
  })

  describe('reactivate user - grpc', () => {
    it('should reactivate user', () => {
      return new Promise<void>(resolve => {
        client.reactivateUser({ id: createdUser.id }, (_err, response) => {
          expect(response.data.email).toEqual(createdUser.email)
          resolve()
        })
      })
    })

    it('should throw object not found error', () => {
      return new Promise<void>(resolve => {
        client.reactivateUser({ id: faker.datatype.uuid() }, (_err, _response) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toBe('Could not resolve one or more User using its id')
          resolve()
        })
      })
    })

    it('should throw banned_user error upon reactivating a banned user', async () => {
      const userId = newObjectId()
      const bannedUserRecord = await UserModel.create({
        _id: userId,
        outlookId: faker.datatype.string(),
        email: faker.internet.email(),
        photoUrl: faker.internet.avatar(),
        name: faker.name.findName(),
        autoJoin: 'auto',
        meetingTier: 'banned'
      })

      return new Promise<void>(resolve => {
        client.reactivateUser({ id: bannedUserRecord.id }, (_err, _response) => {
          expect(_err.code).toEqual(7)
          expect(_err.details).toBe(`Unable to perform action as the user's account is banned`)
          resolve()
        })
      })
    })
  })

  describe('deactivate user - grpc', () => {
    it('should deactivate user', () => {
      return new Promise<void>(resolve => {
        client.deactivateUser({ id: createdUser.id }, (_err, response) => {
          expect(response.data).toEqual(true)
          resolve()
        })
      })
    })

    it('should throw object not found error', () => {
      return new Promise<void>(resolve => {
        client.deactivateUser({ id: faker.datatype.uuid() }, (_err, _response) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toBe('Could not resolve one or more User using its id')
          resolve()
        })
      })
    })
  })

  describe('deleteUserById - grpc', () => {
    it('should delete user', () => {
      return new Promise<void>(resolve => {
        client.deleteUserById({ id: createdUser.id }, (_err, response) => {
          expect(response.data).toEqual(true)
          resolve()
        })
      })
    })

    it('should return object not found error', () => {
      return new Promise<void>(resolve => {
        client.deleteUserById({ id: faker.datatype.uuid() }, (_err, _response) => {
          expect(_err.code).toEqual(3)
          expect(_err.details).toBe('Could not resolve one or more User using its id')
          resolve()
        })
      })
    })
  })
  describe('getAllUsers - grpc', () => {
    let count: number
    it('should get all params as expected', () => {
      return new Promise<void>(resolve => {
        client.getAllUsers(
          {
            select: ['name'],
            pageSize: 10,
            page: 0,
            sort: '',
            order: 1
          },
          (_err, response) => {
            count = response.count
            expect(response.pageInfo).toBeDefined()
            expect(response.count).toBeDefined()
            expect(response.items).toBeDefined()
            resolve()
          }
        )
      })
    })

    it('should test for total count returned in pagination', () => {
      return new Promise<void>(resolve => {
        client.getAllUsers(
          {
            select: [],
            pageSize: 10,
            page: 0,
            sort: '',
            order: 1
          },
          (_err, response) => {
            expect(response.count).toEqual(count)
            resolve()
          }
        )
      })
    })

    it('should test for enforced limit of items per page', () => {
      return new Promise<void>(resolve => {
        const pageSize = Math.floor(Math.random() * count) + 1
        client.getAllUsers(
          {
            select: ['name'],
            pageSize,
            page: 0,
            sort: '',
            order: 1
          },
          (_err, response) => {
            expect(response.items.length).toEqual(pageSize)
            resolve()
          }
        )
      })
    })

    it('should test for enforced params in the items', () => {
      return new Promise<void>(resolve => {
        client.getAllUsers(
          {
            select: ['name', 'email'],
            pageSize: 10,
            page: 0,
            sort: '',
            order: 1
          },
          (_err, response) => {
            expect(Object.prototype.hasOwnProperty.call(response.items[0], 'name')).toEqual(true)
            expect(Object.prototype.hasOwnProperty.call(response.items[0], 'email')).toEqual(true)
            expect(Object.prototype.hasOwnProperty.call(response.items[0], 'name111')).toEqual(false)
            expect(Object.prototype.hasOwnProperty.call(response.items[0], 'email222')).toEqual(
              false
            )
            resolve()
          }
        )
      })
    })
  })
})
