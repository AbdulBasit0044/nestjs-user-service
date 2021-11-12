import { HttpStatus } from '@nestjs/common'
import { DomainError } from './domain.error'

interface BannedUserErrorMetadata {
  userId: string
  emailAddress: string
}

export class BannedUserError extends DomainError<'banned_user', BannedUserErrorMetadata> {
  constructor(readonly metadata: BannedUserErrorMetadata) {
    super({
      name: 'BannedUser',
      code: 'banned_user',
      message: `Unable to perform action as the user's account is banned`,
      status: HttpStatus.FORBIDDEN
    })
  }
}
