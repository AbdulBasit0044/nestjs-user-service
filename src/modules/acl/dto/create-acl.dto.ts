import { IsString, MinLength } from 'class-validator'
import { AclStatus } from '../models'

export class CreateAclDto {
  @IsString()
  client_id: string

  @IsString()
  @MinLength(3)
  service: string

  @IsString()
  secret: string

  @IsString()
  status: AclStatus
}
