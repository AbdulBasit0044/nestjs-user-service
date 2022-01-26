import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PaginatedList } from '@common/models'
import { EventTYPE } from '@common/constants'
import { GetAllUsersParams } from '@modules/grpc/user/user.type'
import { SignUpDto, UpdateUserDto } from '../dto'
import { User } from '../models'
import {
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
  GetUsersByEmailUseCase,
  SignUpUseCase,
  UpdateUserUseCase,
  DeleteUserByIdUseCase,
  ReactivateUserUseCase,
  DeactivateUserUseCase,
  RefreshTokenUseCase,
  GetUsersByIdUseCase,
  GetAllUsersUseCase
} from '../use-cases'
import { UserAutojoinSettingChangeEvent } from '../events'

@Injectable()
export class UserService {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersByIdUseCase: GetUsersByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUsersByEmailUseCase: GetUsersByEmailUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly signUpUseCase: SignUpUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
    private readonly reactivateUserUseCase: ReactivateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly eventEmitter: EventEmitter2
  ) {}

  signUp(input: SignUpDto): Promise<User> {
    return this.signUpUseCase.execute(input)
  }

  getUserById(userId: string, select?: string[]): Promise<User | null> {
    return this.getUserByIdUseCase.execute({ userId, select })
  }

  getUserByEmail(email: string, select?: string[]): Promise<User | null> {
    return this.getUserByEmailUseCase.execute({ email, select })
  }

  async updateUser(userId: string, data: UpdateUserDto = {}): Promise<User> {
    const { autoJoin } = data
    if (autoJoin) {
      const currentUserSnapshot = await this.getUserById(userId)
      if (currentUserSnapshot && currentUserSnapshot.autoJoin !== autoJoin) {
        const event = new UserAutojoinSettingChangeEvent(
          userId,
          currentUserSnapshot.email,
          currentUserSnapshot.autoJoin,
          autoJoin
        )
        this.eventEmitter.emit(EventTYPE.USER_AUTOJOIN_SETTING_CHANGE_EVENT, event)
      }
    }
    return this.updateUserUseCase.execute({ userId, data })
  }

  deleteUserById(userId: string): Promise<boolean> {
    return this.deleteUserByIdUseCase.execute({ userId })
  }

  reactivateUser(userId: string): Promise<User> {
    return this.reactivateUserUseCase.execute({ userId })
  }

  deactivateUser(userId: string): Promise<Boolean> {
    return this.deactivateUserUseCase.execute({ userId })
  }

  renewUserToken(user: User): Promise<User> {
    return this.refreshTokenUseCase.execute(user)
  }

  getUsersByEmail(emails: string[], select?: string[]): Promise<User[]> {
    return this.getUsersByEmailUseCase.execute({ emails, select })
  }

  getUsersById(ids: string[], select?: string[]): Promise<User[]> {
    return this.getUsersByIdUseCase.execute({ ids, select })
  }

  getAllUsers({
    select,
    page,
    pageSize,
    sort,
    order
  }: GetAllUsersParams): Promise<PaginatedList<User>> {
    return this.getAllUsersUseCase.execute({ select, page, pageSize, sort, order })
  }
}
