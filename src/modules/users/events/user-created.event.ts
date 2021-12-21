import { User } from '@modules/users/models'

export class UserCreatedEvent {
  constructor(public readonly user: User, public readonly token: string) {}
}
