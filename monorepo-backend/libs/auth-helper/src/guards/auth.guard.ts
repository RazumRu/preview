import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IAuthTokenData } from '../auth-helper.types'
import { AuthTokenService } from '../auth-token.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authTokenService: AuthTokenService
  ) {}

  async canActivate(context: ExecutionContext) {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler())

    const request = context.switchToHttp().getRequest()
    const jwt = request.headers.authorization || ''
    const token = jwt.split(' ').pop()

    const authTokenData =
      this.authTokenService.parseToken<IAuthTokenData>(token)

    request.authTokenData = authTokenData

    return true
  }
}
