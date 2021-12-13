import { Type } from '@nestjs/common'
import { ModelDefinition, SchemaFactory } from '@nestjs/mongoose'
import { isFunction } from './function.util'

export const getSchemasList = (exportedValues: any): ModelDefinition[] => {
  const registeredSchemas = global.MongoTypeMetadataStorage.schemas
    .map(schema => schema.target.name)
    .filter(Boolean)
  const models = Object.values(exportedValues).filter(
    entity => isFunction(entity) && registeredSchemas.includes(entity.name)
  ) as Type<any>[]

  return models.map(entity => ({
    schema: SchemaFactory.createForClass(entity),
    name: entity.name
  })) as ModelDefinition[]
}
