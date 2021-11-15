import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from '@common/types'

export interface DomainErrorParams<Err extends ErrorCode> {
  message: string
  name: string
  code: Err
  /**
   * @default HttpStatus.BAD_REQUEST
   */
  status?: HttpStatus
}

export class DomainError<
  Err extends ErrorCode,
  TMetadata extends Record<string, any> | undefined = undefined
> extends Error {
  readonly metadata?: TMetadata

  readonly name: string

  readonly code: Err

  readonly subCode?: string

  readonly status: HttpStatus

  constructor({ message, name, code, status = HttpStatus.BAD_REQUEST }: DomainErrorParams<Err>) {
    super()

    this.name = name
    this.code = code
    this.status = status
    this.message = message
  }
}
