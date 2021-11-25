import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import newrelic from 'newrelic'
import { tap } from 'rxjs'

@Injectable()
export class NewRelicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const { name: className } = context.getClass()
    const { name: handlerName } = context.getHandler()

    return newrelic.startWebTransaction(`${className}/${handlerName}`, () => {
      const transaction = newrelic.getTransaction()
      return next.handle().pipe(tap(() => transaction.end()))
    })
  }
}
