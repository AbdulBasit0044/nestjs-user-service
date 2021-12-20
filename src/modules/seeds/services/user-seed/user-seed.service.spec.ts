import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '@modules/users/services'
import {
  UpdateUserUseCase,
  GetUserByIdUseCase,
  GetUsersByIdUseCase,
  SignUpUseCase,
  GetUserByEmailUseCase,
  GetUsersByEmailUseCase,
  RefreshTokenUseCase,
  DeleteUserByIdUseCase,
  ReactivateUserUseCase,
  DeactivateUserUseCase,
  GetAllUsersUseCase
} from '@modules/users/use-cases'
import { createTestUser } from '@modules/users/fixtures'
import { UserSeedService } from './user-seed.service'

const user = createTestUser()
const user2 = createTestUser()

describe('UserSeedService', () => {
  let service: UserSeedService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSeedService,
        UserService,
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(user)
          }
        },
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
          provide: RefreshTokenUseCase,
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
          provide: ReactivateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: DeactivateUserUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emait: jest.fn().mockResolvedValue(user)
          }
        }
      ]
    }).compile()

    service = module.get<UserSeedService>(UserSeedService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
