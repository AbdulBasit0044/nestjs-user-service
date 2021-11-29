import { Logger } from '@nestjs/common'

interface ILog {
  document: any
  action: string
  requestId: string
  serviceName: string
}

export const logInfo = ({ serviceName, action, document, requestId }: ILog) =>
  Logger.log(
    `Request ID: ${requestId} Requested ${action} with details ${JSON.stringify(document)}`,
    serviceName
  )

export const logWarn = ({ serviceName, action, document, requestId }: ILog) =>
  Logger.warn(
    `Request ID: ${requestId} Warning occurred in action: ${action}! ${JSON.stringify(document)}`,
    serviceName
  )

export const logError = ({ serviceName, action, document, requestId }: ILog) =>
  Logger.error(
    `Request ID: ${requestId} Something went wrong in action: ${action}! ${JSON.stringify(
      document
    )}`,
    serviceName
  )
