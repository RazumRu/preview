import { EventEmitter, Injectable } from '@angular/core'
import { LocalStorageService } from 'angular-web-storage'
import { firstValueFrom } from 'rxjs'
import { UsersAuthApiService, TokenDataDto } from './generated/users'

@Injectable({ providedIn: 'root' })
export class AuthenticatorService {
  public updateTokenInProgress = false

  public updateToken$ = new EventEmitter<TokenDataDto | null>()

  public setAuthToken$ = new EventEmitter<TokenDataDto>()

  constructor(
    private local: LocalStorageService,
    private authService: UsersAuthApiService
  ) {}

  public setAuthTokenData(data: TokenDataDto) {
    this.local.set('jwt', data.jwt)
    this.local.set('refresh', data.refresh)
    this.local.set('refreshExpiredAt', data.refreshExpiredAt)
    this.local.set('jwtExpiredAt', data.jwtExpiredAt)

    this.setAuthToken$.emit(data)
  }

  public clearAuthTokenData() {
    this.local.remove('jwt')
    this.local.remove('refresh')
    this.local.remove('refreshExpiredAt')
    this.local.remove('jwtExpiredAt')
  }

  public getAuthTokenData(): TokenDataDto | null {
    if (this.local.get('jwt')) {
      return {
        jwt: this.local.get('jwt'),
        refresh: this.local.get('refresh'),
        refreshExpiredAt: +this.local.get('refreshExpiredAt'),
        jwtExpiredAt: +this.local.get('jwtExpiredAt')
      }
    }
    return null
  }

  public async getOrRefreshAuthToken(): Promise<TokenDataDto | null> {
    const tokenData = this.getAuthTokenData()

    if (!tokenData) {
      return null
    }

    const pastValidTime = Date.now() + 1000 * 60

    if (tokenData.jwtExpiredAt > pastValidTime) {
      return tokenData
    } else {
      if (tokenData.refreshExpiredAt < pastValidTime) {
        this.clearAuthTokenData()
        return null
      }

      if (this.updateTokenInProgress) {
        return null
      }

      this.updateTokenInProgress = true
      try {
        const refreshData = await firstValueFrom(
          this.authService.refresh({
            body: {
              token: tokenData.refresh
            }
          })
        )

        this.setAuthTokenData(refreshData)

        this.updateTokenInProgress = false
        this.updateToken$.emit(refreshData)
        return refreshData
      } catch (e) {
        this.clearAuthTokenData()
        this.updateTokenInProgress = false
        this.updateToken$.emit(null)
        return null
      }
    }
  }
}
