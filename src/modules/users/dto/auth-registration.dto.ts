import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'
import { IsTimeZoneValid } from '@common/decorators'

export class AuthRegistrationDto {
  @IsOptional()
  @IsString()
  @IsTimeZoneValid('timezone', { message: 'invalid timezone' })
  @ApiProperty()
  timezone?: string
}
