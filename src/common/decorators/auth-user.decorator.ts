import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from '@common/types'

export const AuthUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const { user } = context.switchToHttp().getRequest<Request>()
  return user
})
