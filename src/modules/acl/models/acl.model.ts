import { ApiProperty } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators'
import { generateId } from '@common/utils'

export type AclDocument = Acl & Document

export enum AclStatus {
  REVOKED = 'REVOKED',
  ACTIVE = 'ACTIVE'
}

@CustomSchema()
export class Acl extends Entity {
  @ApiProperty()
  @Prop({ unique: true, default: generateId() })
  client_id: string

  @ApiProperty()
  @Prop({ required: true })
  service: string

  @ApiProperty()
  @Prop({ enum: ['REVOKED', 'ACTIVE'], default: AclStatus.ACTIVE })
  status: AclStatus

  @ApiProperty()
  @Prop({ required: true })
  secret: string

  // @ApiProperty()
  // @Prop()
  // roles?: string[]
}
