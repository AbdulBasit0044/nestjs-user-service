import { Injectable } from '@nestjs/common'
import faker from 'faker'
import { Command } from 'nestjs-command'
import { newObjectId } from '@common/utils'
import { UserService } from '@modules/users/services'

@Injectable()
export class UserSeedService {
  constructor(private readonly userService: UserService) {}

  @Command({ command: 'create:user', describe: 'create a batch of users' })
  async create() {
    const users: any = []
    for (let i = 0; i < 10; i++) {
      let user: any = {
        id: newObjectId(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        photoUrl: faker.internet.avatar(),
        autoJoin: 'auto',
        outlookId: newObjectId()
      }
      user = await this.userService.signUp(user)
      users.push(user)
    }
    // eslint-disable-next-line no-console
    console.log(users.map(({ email, id }) => ({ email, id })))
  }
}
