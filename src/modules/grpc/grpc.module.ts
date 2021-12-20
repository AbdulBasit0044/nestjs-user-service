import { Module } from '@nestjs/common'
import { UserModule } from '@modules/users'
import { AclModule } from '@modules/acl'
import { UserGrpcService } from './user'

@Module({
  imports: [UserModule, AclModule],
  controllers: [UserGrpcService]
})
export class GrpcModule {}
