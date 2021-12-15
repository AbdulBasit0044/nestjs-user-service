import faker from 'faker'
import { plainToClass } from 'class-transformer'
import { generateSecret, newObjectId } from '@common/utils'
import { Acl, AclDocument, AclStatus } from '@modules/acl/models'

export const createTestAcl = (params?: Partial<Acl>): AclDocument => {
  return plainToClass(Acl, {
    id: newObjectId(),
    client_id: newObjectId(),
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    service: `${faker.name.firstName().toLowerCase()}-ff`,
    secret: generateSecret(),
    status: AclStatus.ACTIVE,
    ...params
  }) as AclDocument
}
