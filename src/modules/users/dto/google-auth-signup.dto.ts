import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, IsOptional } from 'class-validator'
import { BaseAuthSignUpDto } from './auth-signup-base.dto'

export class GoogleAuthSignUpDto extends BaseAuthSignUpDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly scope: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  referral?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  timezone?: string
}
