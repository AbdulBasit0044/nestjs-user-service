import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

export class ThirdPartyServiceError extends DomainError<'third_party_service'> {
  constructor(serviceName: string) {
    super({
      name: 'Forbidden',
      code: 'third_party_service',
      message: `encountered error when calling ${serviceName} service`,
      status: HttpStatus.INTERNAL_SERVER_ERROR
    })
  }
}
