import { getCqrsHandlers } from '@common/utils/cqrs.util'

export * from './create-acl'
export * from './get-acl-by-service-and-client-id'

export const UseCasesList = getCqrsHandlers(exports, 'useCase')
