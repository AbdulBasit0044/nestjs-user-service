import { Module } from '@nestjs/common'
import { CommandModule } from 'nestjs-command'
import { UserModule } from '@modules/users'
import { AclModule } from '@modules/acl'
import { UserSeedService } from './services/user-seed/user-seed.service'
import { AclSeedService } from './services/acl-seed/acl-seed.service'

@Module({
  imports: [CommandModule, UserModule, AclModule],
  providers: [UserSeedService, AclSeedService],
  exports: [UserSeedService, AclSeedService]
})
export class SeedsModule {}
