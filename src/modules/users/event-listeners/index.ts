import { getCqrsHandlers } from '@common/utils/cqrs.util'

export * from './user-created-event.listener'
export * from './user-deleted-event.listener'
export * from './user-deactivated-event.listener'
export * from './refresh-token-event.listener'
export * from './user-autojoin-setting-change-event.listener'

export const EventListenersList = getCqrsHandlers(exports, 'eventListener')
