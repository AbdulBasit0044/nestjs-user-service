import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { UpdateUserUseCase } from './update-user.use-case'

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            update: jest.fn()
          }
        }
      ]
    }).compile()

    updateUserUseCase = await module.get(UpdateUserUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should update user', async () => {
      const userId = newObjectId()
      const fakeUser = createTestUser({
        id: userId
      })
      const newName = 'new name to the updated'
      jest.spyOn(userRepository, 'update').mockResolvedValue({ ...fakeUser, name: newName })
      const user: any = await updateUserUseCase.execute({ userId, data: { name: newName } })
      expect(user.name).toEqual(newName)
    })
  })
})
