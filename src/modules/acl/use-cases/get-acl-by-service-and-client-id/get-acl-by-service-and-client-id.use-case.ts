import { Injectable } from '@nestjs/common'
import { IUseCase } from '@common/types'
import { AclRepository } from '@modules/acl/repositories'
import { Acl } from '@modules/acl/models'

export interface GetAclByServiceAndClientIdParams {
  service: string
  client_id: string
}

@Injectable()
export class GetAclByServiceAndClientIdUseCase
  implements IUseCase<GetAclByServiceAndClientIdParams, Acl | null>
{
  constructor(private readonly aclRepository: AclRepository) {}

  async execute(params: GetAclByServiceAndClientIdParams): Promise<Acl | null> {
    const acl = await this.aclRepository.getByServiceAndClientId(params)
    return acl
  }
}
