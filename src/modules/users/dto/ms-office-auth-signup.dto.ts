import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'
import { BaseAuthSignUpDto } from './auth-signup-base.dto'

export class MsOfficeSignUpDto extends BaseAuthSignUpDto {
  @ApiProperty()
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
