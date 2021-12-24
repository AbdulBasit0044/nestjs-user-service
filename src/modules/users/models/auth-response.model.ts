import { ApiProperty } from '@nestjs/swagger'
import { User } from './user.model'

export class AuthResponse {
  @ApiProperty({
    example: 'xxxxxxxxxx.xxxxxx.xxxxx',
    description: 'jwt signed token against user id, field for validating state'
  })
  token?: string

  @ApiProperty({
    description: 'boolean field indicating whether it is a new user or an old one'
  })
  isNewUser?: boolean

  @ApiProperty({
    description: 'contains user information'
  })
  user: User
}
