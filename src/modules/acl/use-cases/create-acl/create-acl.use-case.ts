import { Injectable } from '@nestjs/common'
import { ObjectAlreadyExistsError } from '@common/errors'
import { IUseCase } from '@common/types'
import { Acl } from '@modules/acl/models'
import { AclRepository } from '@modules/acl/repositories'
import { CreateAclDto } from '@modules/acl/dto'

export type CreateAclParams = CreateAclDto

@Injectable()
export class CreateAclUseCase implements IUseCase<CreateAclParams, Acl> {
  constructor(private readonly aclRepository: AclRepository) {}

  async execute(input: CreateAclParams): Promise<Acl> {
    const existingAcl = await this.aclRepository.getByServiceAndClientId(input)

    if (existingAcl) {
      throw new ObjectAlreadyExistsError({
        field: 'service',
        objectType: 'Acl'
      })
    }

    const acl = await this.aclRepository.create(input)

    return acl
  }
}
