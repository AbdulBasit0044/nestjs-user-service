import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { catchError } from 'rxjs'
import { Request } from '@common/types'
import { logError, logInfo } from '@common/logger'
import { newObjectId } from '@common/utils'

const skipActions = ['check']
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    let serviceName: string
    let document
    const requestId = newObjectId()

    switch (context.getType()) {
      case 'http':
        const req = context.switchToHttp().getRequest<Request>()
        serviceName = req.headers['x-service'] as string
        document = { body: req.body, query: req.query, params: req.params }
        break
      case 'rpc':
        const rpc = context.switchToRpc()
        serviceName = rpc.getContext().get('x-service')?.[0]
        document = rpc.getData()
        break
    }

    serviceName ||= ''

    const action = context.getHandler().name
    if (!skipActions.includes(action)) {
      logInfo({ serviceName, action, document, requestId })
    }

    return next.handle().pipe(
      catchError(error => {
        logError({ serviceName, action, document: error, requestId })
        throw error
      })
    )
  }
}
