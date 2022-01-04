import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class BaseAuthSignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly state: string

  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly code: string
}
