import { Test } from '@nestjs/testing'
import { createTestUser } from '@modules/users/fixtures'
import { UserRepository } from '@modules/users/repositories'
import { GetAllUsersUseCase } from './get-all-users.use-case'

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase
  let userRepository: UserRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAllUsersUseCase,
        {
          provide: UserRepository,
          useValue: {
            getAll: jest.fn()
          }
        }
      ]
    }).compile()

    getAllUsersUseCase = await module.get(GetAllUsersUseCase)
    userRepository = await module.get(UserRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(GetAllUsersUseCase).toBeDefined()
    expect(userRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get all populated Users', async () => {
      const pageInfo = {
        currentPage: 1,
        perPage: 10,
        itemCount: 10,
        pageCount: 10,
        hasNextPage: true,
        hasPreviousPage: true
      }
      const count = 2
      const email2 = 'hamza@ff.com'
      const email = 'dummy@example.com'
      const fakeUser = createTestUser({
        email
      })

      const fakeUser2 = createTestUser({
        email: email2
      })

      const items = [fakeUser, fakeUser2]
      jest.spyOn(userRepository, 'getAll').mockResolvedValue({ pageInfo, count, items })
      const res = await getAllUsersUseCase.execute({
        select: [],
        pageSize: 10,
        page: 1,
        sort: '1',
        order: 0
      })

      expect(res.count).toEqual(2)
      expect(res.items.length).toEqual(2)
    })
    it('should return an empty items array when no users are provided', async () => {
      const pageInfo = {
        currentPage: 1,
        perPage: 10,
        itemCount: 0,
        pageCount: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
      const count = 0
      const items = []
      const props = {
        select: ['name'],
        pageSize: 10,
        page: 1,
        sort: '',
        order: 1
      }
      jest.spyOn(userRepository, 'getAll').mockResolvedValue({ pageInfo, count, items })
      const res = await getAllUsersUseCase.execute(props)
      expect(userRepository.getAll).toHaveBeenCalledWith(props)
      expect(res.items.length).toEqual(0)
    })

    it('Returns empty items array when no mock is provided', async () => {
      jest.spyOn(userRepository, 'getAll')
      const res = await getAllUsersUseCase.execute({
        select: ['sendNotesTo'],
        pageSize: 0,
        page: 1,
        sort: 'sendNotesTo',
        order: 0
      })
      expect(res.count).toEqual(0)
    })

    it('Returns only selected fields when select is set', async () => {
      const pageInfo = {
        currentPage: 1,
        perPage: 10,
        itemCount: 50,
        pageCount: 5,
        hasNextPage: true,
        hasPreviousPage: false
      }
      const count = 50
      const fakeUser1 = createTestUser()
      const items = [fakeUser1]
      const props = {
        select: ['name', 'id'],
        pageSize: 10,
        page: 5,
        sort: 'id',
        order: 1
      }
      for (let i = 1; i < 50; i++) {
        const nFakeUser = createTestUser()
        items.push(nFakeUser)
      }
      jest.spyOn(userRepository, 'getAll').mockResolvedValue({ pageInfo, count, items })
      const res = await getAllUsersUseCase.execute(props)
      expect(userRepository.getAll).toHaveBeenCalledWith(props)
      expect(
        res.items.filter(e => e.id && e.name != null && e.outlookId == null && e.createdAt == null)
          .length
      ).toEqual(50)
    })
  })
})
