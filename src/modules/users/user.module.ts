import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AclModule } from '@modules/acl'
import { GlobalConfigModule } from '../global-configs/global-config.module'
import { AuthService, UserService } from './services'
import { EventListenersList } from './event-listeners'
import { UserRepository } from './repositories'
import { AuthController } from './controllers'
import { UseCasesList } from './use-cases'
import { SchemasList } from './models'

@Module({
  imports: [MongooseModule.forFeature(SchemasList), GlobalConfigModule, AclModule],
  providers: [UserRepository, AuthService, UserService, ...UseCasesList, ...EventListenersList],
  controllers: [AuthController],
  exports: [AuthService, UserService]
})
export class UserModule {}
