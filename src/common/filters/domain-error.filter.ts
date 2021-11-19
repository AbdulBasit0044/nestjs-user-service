import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { DomainError } from '@common/errors'
import { IS_PROD } from '@common/constants'

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError<any, any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    if (IS_PROD) {
      delete exception.stack
    }

    res.status(exception.status).json(exception)
  }
}
