import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ForbiddenError, InvalidTokenError, UnauthenticatedError } from '@common/errors'
import { Role, Request } from '../types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { tokenStatus, user } = context.switchToHttp().getRequest<Request>()

    if (tokenStatus === 'missing') throw new UnauthenticatedError()

    if (tokenStatus && tokenStatus !== 'valid') {
      throw new InvalidTokenError({
        status: tokenStatus
      })
    }

    if (!user) throw new UnauthenticatedError()

    const roles = this.reflector.get<Role[]>('roles', context.getHandler())

    if (!roles) return true

    if (!roles.includes(user.role)) {
      throw new ForbiddenError()
    }

    return true
  }
}
