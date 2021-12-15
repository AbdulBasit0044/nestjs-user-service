import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Acl } from '@modules/acl/models'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclRepository } from '../acl.repository'

const acl = createTestAcl()

describe('AclRepository', () => {
  let aclRepository: AclRepository
  let aclModel: Model<Acl>

  beforeAll(async () => {
    const modelToken = getModelToken(Acl.name)
    const module = await Test.createTestingModule({
      providers: [
        AclRepository,
        {
          provide: modelToken,
          useValue: {
            create: jest.fn().mockResolvedValue(acl),
            findOne: jest.fn(),
            exists: jest.fn()
          }
        }
      ]
    }).compile()

    aclRepository = await module.get(AclRepository)
    aclModel = await module.get(modelToken)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(aclRepository).toBeDefined()
    expect(aclModel).toBeDefined()
  })

  describe('create', () => {
    it('should create an user successfully', async () => {
      const response = await aclRepository.create(acl)
      expect(response).toMatchObject(acl)
    })
  })

  describe('get by service name', () => {
    it('should return null if service is not found', async () => {
      jest.spyOn(aclModel, 'findOne').mockResolvedValueOnce(null)

      const response = await aclRepository.getByServiceAndClientId({
        service: 'unknown-service',
        client_id: 'unknown-client-id'
      })
      expect(response).toBe(null)
    })
    it('should get the user successfully', async () => {
      jest.spyOn(aclModel, 'findOne').mockResolvedValueOnce(acl)

      const response = await aclRepository.getByServiceAndClientId(acl)
      expect(response).toBeInstanceOf(Acl)
      expect(response?.secret).toEqual(acl.secret)
    })
  })
})
