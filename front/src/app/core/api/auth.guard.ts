import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthenticatorService } from './authenticator.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authenticatorService: AuthenticatorService,
    private readonly router: Router
  ) {}

  async canActivate() {
    try {
      const tokenData = await this.authenticatorService.getOrRefreshAuthToken()

      if (!tokenData) {
        throw Error('Auth token not found')
      }

      return true
    } catch (e) {
      console.error(e)
      await this.router.navigateByUrl('/admin-panel/auth/login')
      return false
    }
  }
}
