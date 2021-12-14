import { IsString, MinLength } from 'class-validator'

export class GetAclByServiceAndClientIdDto {
  @IsString()
  client_id: string

  @IsString()
  @MinLength(3)
  service: string
}
