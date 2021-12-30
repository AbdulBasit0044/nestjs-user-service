import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import faker from 'faker'
import { newObjectId } from '@common/utils'
import { EventTYPE } from '@common/constants'
import { createTestUser } from '@modules/users/fixtures'
import {
  GetUserByIdUseCase,
  GetUsersByIdUseCase,
  GetUserByEmailUseCase,
  GetUsersByEmailUseCase,
  SignUpUseCase,
  UpdateUserParams,
  UpdateUserUseCase,
  DeleteUserByIdUseCase,
  ReactivateUserUseCase,
  DeactivateUserUseCase,
  RefreshTokenUseCase,
  GetAllUsersUseCase
} from '@modules/users/use-cases'
import { UserService } from '@modules/users/services'

const user = createTestUser()
const user2 = createTestUser()

describe('UserService', () => {
  let userService: UserService
  const eventEmitterMock = jest.fn()

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: GetUserByIdUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: GetUsersByIdUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([user])
          }
        },
        {
          provide: GetUserByEmailUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: GetUsersByEmailUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([user, user2])
          }
        },
        {
          provide: GetAllUsersUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([user, user2])
          }
        },
        {
          provide: SignUpUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: DeleteUserByIdUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: ({ userId, data }: UpdateUserParams) => {
              if (userId !== user.id) return user
              const updatedUser = { ...user, ...data }
              return updatedUser
            }
          }
        },
        {
          provide: ReactivateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: DeactivateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: eventEmitterMock.mockImplementation(data => data)
          }
        }
      ]
    }).compile()

    userService = await module.get(UserService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('signUp', () => {
    it('should return user payload', async () => {
      const createdUser = await userService.signUp({
        outlookId: faker.datatype.string(),
        email: faker.internet.email(),
        name: faker.name.title(),
        autoJoin: 'manual'
      })
      expect(createdUser).toEqual(user)
    })
  })

  describe('getUserById', () => {
    it('should return user for id', async () => {
      const res = await userService.getUserById(newObjectId())
      expect(res).toEqual(user)
    })
  })

  describe('getUserByEmail', () => {
    it('should return user for email', async () => {
      const data = await userService.getUserByEmail(user.email)
      expect(data).not.toBe(null)
    })
  })

  describe('reactivateUser', () => {
    it('should reactivate and return the user', async () => {
      const response = await userService.reactivateUser(newObjectId())
      expect(response).toEqual(user)
    })
  })
  describe('deactivateUser', () => {
    it('should deactivate and return the reponse', async () => {
      const response = await userService.deactivateUser(newObjectId())
      expect(response).toEqual(true)
    })
  })
  describe('update', () => {
    it('should return updated user payload', async () => {
      const name = faker.name.title()
      const updatedUser = await userService.updateUser(user.id, { name })
      expect(updatedUser.name).toEqual(name)
    })

    it('should be able to detect autojoin setting change while updating user object', async () => {
      const name = faker.name.title()
      const updatedUser = await userService.updateUser(user.id, { name, autoJoin: 'autoself' })
      expect(eventEmitterMock).toHaveBeenCalled()
      expect(eventEmitterMock).toBeCalledWith(EventTYPE.USER_AUTOJOIN_SETTING_CHANGE_EVENT, {
        userId: user.id,
        email: user.email,
        oldAutojoinSetting: user.autoJoin,
        newAutojoinSetting: 'autoself'
      })
      expect(updatedUser.name).toEqual(name)
    })

    it('should not detect autojoin setting change if user is not updating autoJoin field', async () => {
      const name = faker.name.title()
      const updatedUser = await userService.updateUser(user.id, { name, autoJoin: user.autoJoin })
      expect(eventEmitterMock).toBeCalledTimes(0)
      expect(updatedUser.name).toEqual(name)
    })
  })
  describe('deleteUserById', () => {
    it('should return delete user payload', async () => {
      const res = await userService.deleteUserById(user.id)
      expect(res).toEqual(true)
    })
  })
})
