import { Injectable } from '@nestjs/common'
import { BaseRepositoryMongo } from '@common/classes'
import { matchesGenericEmail, toTimestamp } from '@common/utils'
import { PaginatedList } from '@common/models'
import { GetAllUsersParams } from '@modules/grpc/user/user.type'
import { User } from '../models'
import { CreateUserInput, AuthUserObject } from '../types'

@Injectable()
export class UserRepository extends BaseRepositoryMongo<User>(User) {
  async create(input: CreateUserInput): Promise<User> {
    const user = await super.create(input)
    return user
  }

  async getById(id: string, select?: string[]): Promise<User | null> {
    const selectable = this.getSelectable(select)
    const user = await this.model.findById(id, selectable)
    return user
  }

  async getByEmail(email: string, select?: string[]): Promise<User | null> {
    const selectable = this.getSelectable(select)
    const user = await this.model.findOne({ email }, selectable)
    return user
  }

  async getByEmails(emails: string[], select?: string[]): Promise<User[]> {
    const selectable = this.getSelectable(select)
    const users = await this.model.find({ email: { $in: emails } }, selectable)
    return users
  }

  async getByIds(ids: string[], select?: string[]): Promise<User[]> {
    const selectable = this.getSelectable(select)
    const users = await this.model.find({ _id: { $in: ids } }, selectable)
    return users
  }

  async getAll({
    select,
    page,
    pageSize,
    sort,
    order
  }: GetAllUsersParams): Promise<PaginatedList<User>> {
    const selectable = this.getSelectable(select)
    const queryOptions = this.getQueryOptions({ page, pageSize, sort, order })
    const data = await this.model.find({}, selectable, queryOptions)
    const count = await this.model.count({})
    const response = this.createPaginationPayload({ data, page, pageSize, count })
    return response
  }

  async createOrUpdateUser(profile: CreateUserInput, auth: AuthUserObject): Promise<User> {
    const record = await this.getByEmail(profile.email)

    if (!record) {
      const user = new User()
      const authCredentials = this.updateAuthCredentials(user, auth)
      Object.assign(user, {
        name: profile.name,
        email: profile.email,
        autoJoin: profile.autoJoin,
        paidUser: 'portalBypass',
        meetingTier: 'portalBypass',
        privacy: 'link',
        sendNotesTo: 'all',
        numMeetingsWithNotes: 0,
        freeMeetingsLeft: matchesGenericEmail(profile.email) ? 1 : 3,
        notesInjected: 0,
        ...(profile.googleId && { googleId: profile.googleId }),
        ...(profile.outlookId && { outlookId: profile.outlookId }),
        ...(profile.timezone && { timezone: profile.timezone }),
        profile: { name: profile.name },
        authCredentials
      })
      const createdUser = await super.create(user)
      return createdUser
    }
    // old user
    Object.assign(record, this.updateAuthCredentials(record, auth))

    if (profile.timezone) {
      record.timezone = profile.timezone
    }
    await this.update(record.id, record)
    return record
  }

  async updateUserAuth(user: User, auth: AuthUserObject): Promise<User> {
    const userRecord = this.updateAuthCredentials(user, auth)
    await this.update(user.id, userRecord)
    return userRecord
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.exists({ email })
  }

  private updateAuthCredentials(userRecord: User, auth: AuthUserObject): User {
    if (auth.isGoogle) {
      userRecord.gauth = {
        access_token: auth.accessToken,
        expires_at: toTimestamp(auth.expiresAt),
        id_token: auth.idToken || '',
        refresh_token: auth.refreshToken,
        token_type: 'refresh_token',
        type: 'gauth'
      }
    } else if (auth.isMsOffice) {
      userRecord.officeAuth = {
        access_token: auth.accessToken,
        expires_at: toTimestamp(auth.expiresAt),
        grant_type: 'refresh_token',
        refresh_token: auth.refreshToken,
        token_type: 'refresh_token',
        type: 'officeAuth',
        scope: auth.scope?.join('') || ''
      }
    }
    return userRecord
  }
}
