import { Injectable } from '@nestjs/common'
import { Command } from 'nestjs-command'
import { AclService } from '@modules/acl/services/acl.service'
import { createTestAcl } from '@modules/acl/fixtures'
import { AclStatus } from '@modules/acl/models'

@Injectable()
export class AclSeedService {
  constructor(private readonly aclService: AclService) {}

  @Command({ command: 'create:acl', describe: 'create a batch of acls' })
  async create() {
    const acls: any = []
    for (let i = 0; i < 10; i++) {
      let acl: any = createTestAcl({ status: i % 2 === 0 ? AclStatus.ACTIVE : AclStatus.REVOKED })
      acl = await this.aclService.createAcl(acl)
      acls.push(acl)
    }
    // eslint-disable-next-line no-console
    console.log(acls.map(({ client_id, service, status }) => ({ client_id, service, status })))
  }
}
