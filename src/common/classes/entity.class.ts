import { Prop } from '@nestjs/mongoose'
import { newObjectId } from '@common/utils'
import { CustomSchema } from '@common/decorators'

export interface Entity {
  createdAt: Date
  updatedAt: Date
  id: string
}
@CustomSchema()
export class Entity {
  @Prop({ default: newObjectId })
  _id: string
}
