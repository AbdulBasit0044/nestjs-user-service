import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GlobalConfigModule } from '../global-configs/global-config.module'
import { SchemasList } from './models'
import { AclRepository } from './repositories'
import { AclService } from './services/acl.service'
import { UseCasesList } from './use-cases'

@Module({
  imports: [MongooseModule.forFeature(SchemasList), GlobalConfigModule],
  providers: [AclRepository, AclService, ...UseCasesList],
  controllers: [],
  exports: [AclService]
})
export class AclModule {}
