import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

export class BadRequestError extends DomainError<'bad_request'> {
  constructor({ message }) {
    super({
      name: 'Bad Request',
      code: 'bad_request',
      message,
      status: HttpStatus.BAD_REQUEST
    })
  }
}
