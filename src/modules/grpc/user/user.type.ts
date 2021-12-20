import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { BaseRpcResponse, QueryOptionsParams } from '@common/types'
import { User } from '@modules/users/models'
import { UpdateUserDto } from '@modules/users/dto'

export interface GetUserByIdParams {
  id: string

  select?: string[]
}
export interface DeleteUserByIdParams {
  id: string
}

export interface GetUserByEmailParams {
  email: string

  select?: string[]
}

export interface GetUserResponse extends BaseRpcResponse {
  data?: User
}

export class UserUpdateParams {
  @IsString()
  id: string

  @ValidateNested()
  @Type(() => UpdateUserDto)
  data: UpdateUserDto
}

export class ReactivateUserParams {
  @IsString()
  id: string
}
export class DeactivateUserParams {
  @IsString()
  id: string
}

export interface GetUsersByEmailParams {
  emails: string[]

  select?: string[]
}

export interface GetUsersByIdsParams {
  ids: string[]

  select?: string[]
}

export interface GetAllUsersParams extends QueryOptionsParams {
  select?: string[]
}
