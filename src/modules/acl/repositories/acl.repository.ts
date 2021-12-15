import { Injectable } from '@nestjs/common'
import { BaseRepositoryMongo } from '@common/classes'
import { Acl } from '../models'
import { CreateAclDto, GetAclByServiceAndClientIdDto } from '../dto'

@Injectable()
export class AclRepository extends BaseRepositoryMongo<Acl>(Acl) {
  async create(input: CreateAclDto): Promise<Acl> {
    const acl = await super.create(input)
    return acl
  }

  async getByServiceAndClientId({
    service,
    client_id
  }: GetAclByServiceAndClientIdDto): Promise<Acl | null> {
    const acl = await this.model.findOne({ service, client_id })
    return acl
  }
}
