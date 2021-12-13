import { Provider } from '@nestjs/common'
import { isFunction } from './function.util'

/**
 * @param exportedValues pass the exports
 * @param searchStr
 * @example
 * ```ts
 * export * from './command1'
 * export * from './command2'
 *
 * export const CommandHandlers = getCqrsHandlers(exports)
 * ```
 */
export const getCqrsHandlers = (exportedValues: any, searchStr: string): Provider[] => {
  return Object.values(exportedValues).filter(
    handler => isFunction(handler) && new RegExp(searchStr, 'i').test(handler.name)
  ) as Provider[]
}
