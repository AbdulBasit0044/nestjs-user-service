import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response } from 'express'
import { AUTH_HEADER } from '@common/constants'
import { Request } from '@common/types'
import { AuthService } from '@modules/users/services'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, _res: Response, next: Function) {
    if (req.headers[AUTH_HEADER]) {
      const { tokenStatus, user } = this.authService.getTokenFromHeader(req.headers[AUTH_HEADER])
      req.tokenStatus = tokenStatus
      req.user = user
    }
    next()
  }
}
