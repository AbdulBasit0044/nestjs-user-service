import { Test } from '@nestjs/testing'
import { newObjectId } from '@common/utils'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclRepository } from '@modules/acl/repositories'
import { GetAclByServiceAndClientIdUseCase } from './get-acl-by-service-and-client-id.use-case'

describe('GetAclByServiceAndClientIdUseCase', () => {
  let getAclByServiceAndClientIdUseCase: GetAclByServiceAndClientIdUseCase
  let aclRepository: AclRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAclByServiceAndClientIdUseCase,
        {
          provide: AclRepository,
          useValue: {
            getByServiceAndClientId: jest.fn()
          }
        }
      ]
    }).compile()

    getAclByServiceAndClientIdUseCase = await module.get(GetAclByServiceAndClientIdUseCase)
    aclRepository = await module.get(AclRepository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(getAclByServiceAndClientIdUseCase).toBeDefined()
    expect(aclRepository).toBeDefined()
  })

  describe('execute', () => {
    it('should get an acl', async () => {
      const fakeAcl = createTestAcl({
        _id: newObjectId()
      })
      jest.spyOn(aclRepository, 'getByServiceAndClientId').mockResolvedValue(fakeAcl)
      const payload = {
        service: fakeAcl.service,
        client_id: newObjectId()
      }
      const acl = await getAclByServiceAndClientIdUseCase.execute(payload)
      expect(aclRepository.getByServiceAndClientId).toHaveBeenCalledWith(payload)
      expect(acl).toEqual(fakeAcl)
    })
    it('should return null', async () => {
      const payload = {
        service: newObjectId(), // some non existing value
        client_id: newObjectId()
      }
      jest.spyOn(aclRepository, 'getByServiceAndClientId').mockResolvedValue(null)
      const acl = await getAclByServiceAndClientIdUseCase.execute(payload)
      expect(aclRepository.getByServiceAndClientId).toHaveBeenCalledWith(payload)
      expect(acl).toEqual(null)
    })
  })
})
