import { SentryService } from '@ntegral/nestjs-sentry'
import { CaptureContext, Severity, Event } from '@sentry/types'

export function setSentryContext(
  client: SentryService,
  message: string,
  context: { [key: string]: any }
) {
  return client.instance().setContext(message, context)
}

export function captureSentryMessage(
  client: SentryService,
  message: string,
  captureContext?: CaptureContext | Severity
) {
  return client.instance().captureMessage(message, captureContext)
}

export function captureSentryException(
  client: SentryService,
  exception: any,
  captureContext?: CaptureContext
) {
  return client.instance().captureException(exception, captureContext)
}

export function captureSentryEvent(client: SentryService, event: Event) {
  return client.instance().captureEvent(event)
}
