import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator'

export class SignUpDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string

  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string

  @IsEmail()
  @ApiProperty()
  email: string

  @IsString()
  @ApiProperty()
  autoJoin: string

  @IsString()
  @ApiProperty()
  outlookId: string
}
