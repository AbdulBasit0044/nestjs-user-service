import { GrpcMethod } from '@nestjs/microservices'
// import { UseGuards } from '@nestjs/common'
import { Metadata } from '@grpc/grpc-js'
import { GrpcController, UseNewRelic } from '@common/decorators'
import { ObjectNotFoundError } from '@common/errors'
// import { AclGuard } from '@common/guards/acl.guard'
import { REFRESH_TOKEN_HEADER } from '@common/constants'
import { PaginatedList } from '@common/models'
import { UserService } from '@modules/users/services'
import { User } from '@modules/users/models'
import {
  GetUserByIdParams,
  GetUsersByIdsParams,
  GetUserByEmailParams,
  UserUpdateParams,
  DeleteUserByIdParams,
  ReactivateUserParams,
  DeactivateUserParams,
  GetUsersByEmailParams,
  GetAllUsersParams
} from './user.type'

@GrpcController()
// @UseGuards(AclGuard)
export class UserGrpcService {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod()
  @UseNewRelic()
  async getUserById({ id, select }: GetUserByIdParams, metadata: Metadata): Promise<User> {
    const upDatedSelect = this.generateUserSelect(select, metadata)
    const user = await this.userService.getUserById(id, upDatedSelect)
    if (!user) {
      throw new ObjectNotFoundError({
        field: 'id',
        objectType: 'User'
      })
    }

    return this.processUserData(metadata, user)
  }

  @GrpcMethod()
  @UseNewRelic()
  async getUserByEmail({ email, select }: GetUserByEmailParams, metadata: Metadata): Promise<User> {
    const upDatedSelect = this.generateUserSelect(select, metadata)
    const user = await this.userService.getUserByEmail(email, upDatedSelect)

    if (!user) {
      throw new ObjectNotFoundError({
        field: 'email',
        objectType: 'User'
      })
    }

    return this.processUserData(metadata, user)
  }

  @GrpcMethod()
  @UseNewRelic()
  async deleteUserById({ id }: DeleteUserByIdParams) {
    const res = await this.userService.deleteUserById(id)
    return res
  }

  @GrpcMethod()
  @UseNewRelic()
  async updateUser({ id, data }: UserUpdateParams) {
    const user = await this.userService.updateUser(id, data)
    return user
  }

  @GrpcMethod()
  @UseNewRelic()
  async reactivateUser({ id }: ReactivateUserParams) {
    const response = await this.userService.reactivateUser(id)
    return response
  }

  @GrpcMethod()
  @UseNewRelic()
  async deactivateUser({ id }: DeactivateUserParams) {
    const response = await this.userService.deactivateUser(id)
    return response
  }

  @GrpcMethod()
  @UseNewRelic()
  async getUsersByEmail({ emails, select }: GetUsersByEmailParams) {
    const users = await this.userService.getUsersByEmail(emails, select)
    return users
  }

  @GrpcMethod()
  @UseNewRelic()
  async getUsersById({ ids, select }: GetUsersByIdsParams) {
    const users = await this.userService.getUsersById(ids, select)
    return users
  }

  @GrpcMethod()
  @UseNewRelic()
  async getAllUsers({
    select,
    page,
    pageSize,
    sort,
    order
  }: GetAllUsersParams): Promise<PaginatedList<User>> {
    const users = await this.userService.getAllUsers({ select, page, pageSize, sort, order })
    return users
  }

  private generateUserSelect(
    select: string[] | undefined,
    metadata: Metadata
  ): string[] | undefined {
    const { [REFRESH_TOKEN_HEADER]: refreshTokenHeader } = metadata.getMap()
    if (refreshTokenHeader === 'true' && select) {
      // ensure they are added to the select
      if (!select.includes('gauth')) select.push('gauth')
      if (!select.includes('officeAuth')) select.push('officeAuth')
    }
    return select
  }

  private async processUserData(metadata: Metadata, user: User): Promise<User> {
    const { [REFRESH_TOKEN_HEADER]: refreshTokenHeader } = metadata.getMap()
    if (refreshTokenHeader === 'true') {
      const updatedUser = await this.userService.renewUserToken(user)
      return updatedUser
    }
    delete user.gauth
    delete user.officeAuth

    return user
  }
}
