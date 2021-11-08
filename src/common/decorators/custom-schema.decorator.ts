import { applyDecorators } from '@nestjs/common'
import { SchemaOptions, Schema } from '@nestjs/mongoose'

export function transformToJson(ret: any) {
  const newObj = {
    ...ret
  }
  delete newObj.__v
  newObj.id = newObj._id
  delete newObj._id
  return newObj
}

export function CustomSchema(options?: SchemaOptions) {
  return applyDecorators(
    Schema({
      timestamps: true,
      id: true,
      ...options,
      toJSON: {
        ...options?.toJSON,
        transform: (doc, ret, tOptions) => {
          const newRet = transformToJson(ret)
          return typeof options?.toJSON?.transform === 'function'
            ? options.toJSON.transform(doc, newRet, tOptions)
            : newRet
        }
      }
    })
  )
}
