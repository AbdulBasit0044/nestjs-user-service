import { Test } from '@nestjs/testing'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclRepository } from '@modules/acl/repositories'
import { CreateAclUseCase } from './create-acl.use-case'

const acl = createTestAcl()

describe('CreateAclUseCase', () => {
  let createAclUseCase: CreateAclUseCase
  let aclRepository: AclRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateAclUseCase,
        {
          provide: AclRepository,
          useValue: {
            getByServiceAndClientId: jest.fn(),
            create: jest.fn()
          }
        }
      ]
    }).compile()

    createAclUseCase = await module.get(CreateAclUseCase)
    aclRepository = await module.get(AclRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(createAclUseCase).toBeDefined()
    expect(aclRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should create an user successfully', async () => {
      jest.spyOn(aclRepository, 'create').mockResolvedValueOnce(acl)

      const response = await createAclUseCase.execute(acl)
      expect(response).toMatchObject(acl)
    })
  })
})
