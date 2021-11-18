import { ObjectType } from '@common/types'
import { DomainError } from './domain.error'

interface ObjectNotFoundErrorMetadata {
  objectType: ObjectType
  field: string
}

export class ObjectNotFoundError extends DomainError<
  'object_not_found',
  ObjectNotFoundErrorMetadata
> {
  constructor(readonly metadata: ObjectNotFoundErrorMetadata) {
    super({
      name: 'ObjectNotFoundError',
      code: 'object_not_found',
      message: `Could not resolve one or more ${metadata.objectType} using its ${metadata.field}`
    })
  }
}
