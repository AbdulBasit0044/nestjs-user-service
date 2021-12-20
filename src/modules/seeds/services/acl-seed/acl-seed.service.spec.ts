import { Test, TestingModule } from '@nestjs/testing'
import { AclService } from '@modules/acl/services/acl.service'
import { CreateAclUseCase, GetAclByServiceAndClientIdUseCase } from '@modules/acl/use-cases'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclSeedService } from './acl-seed.service'

const acl = createTestAcl()

describe('AclSeedService', () => {
  let service: AclSeedService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AclSeedService,
        AclService,
        {
          provide: CreateAclUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(acl)
          }
        },
        {
          provide: GetAclByServiceAndClientIdUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(acl)
          }
        }
      ]
    }).compile()

    service = module.get<AclSeedService>(AclSeedService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
