import faker from 'faker'
import { plainToClass } from 'class-transformer'
import { newObjectId } from '@common/utils'
import { User, UserDocument } from '@modules/users/models'

export const createTestUser = (params?: Partial<User>): UserDocument => {
  return plainToClass(User, {
    id: newObjectId(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    photoUrl: faker.internet.avatar(),
    autoJoin: faker.name.findName(),
    ...params
  }) as UserDocument
}
