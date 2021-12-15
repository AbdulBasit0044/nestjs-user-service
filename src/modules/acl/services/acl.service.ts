import { Injectable } from '@nestjs/common'
import { CreateAclDto, GetAclByServiceAndClientIdDto } from '../dto'
import { Acl } from '../models'
import { CreateAclUseCase, GetAclByServiceAndClientIdUseCase } from '../use-cases'

@Injectable()
export class AclService {
  constructor(
    private readonly createAclUseCase: CreateAclUseCase,
    private readonly getAclByServiceAndClientIdUseCase: GetAclByServiceAndClientIdUseCase
  ) {}

  createAcl(input: CreateAclDto): Promise<Acl> {
    return this.createAclUseCase.execute(input)
  }

  getAclByServiceAndClientId(input: GetAclByServiceAndClientIdDto): Promise<Acl | null> {
    return this.getAclByServiceAndClientIdUseCase.execute(input)
  }
}
