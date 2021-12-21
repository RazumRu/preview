import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthTokenService, IAuthTokenData } from '@passed-way/auth-helper'
import { NotFoundCustomException } from '@passed-way/error'
import { Cache } from 'cache-manager'
import ms from 'ms'
import * as uuid from 'uuid'
import {
  IAuthSessionData,
  ICreatedAuthSessionData,
  ICreatedAuthTokenData
} from '../auth.types'

@Injectable()
export class SessionService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
    private authTokenService: AuthTokenService
  ) {}

  public async createSession(
    data: IAuthTokenData
  ): Promise<ICreatedAuthSessionData> {
    const tokenData = await this.createToken(data)

    const sessionData: IAuthSessionData = {
      userId: data.userId,
      uuid: tokenData.refresh,
      expiredAt: tokenData.refreshExpiredAt
    }

    await this.cacheManager.set(
      tokenData.refresh,
      JSON.stringify(sessionData),
      {
        ttl: Math.ceil((tokenData.refreshExpiredAt - Date.now()) / 1000)
      }
    )

    return { tokenData, sessionData }
  }

  public async refreshSession(
    refresh: string
  ): Promise<ICreatedAuthSessionData> {
    const sessionJson = await this.cacheManager.get(refresh)

    if (!sessionJson) {
      throw new NotFoundCustomException()
    }

    const session: IAuthSessionData = JSON.parse(String(sessionJson))

    await this.cacheManager.del(refresh)

    const tokenData: IAuthTokenData = {
      userId: session.userId
    }

    return this.createSession(tokenData)
  }

  private createToken(data: IAuthTokenData): ICreatedAuthTokenData {
    const jwtExpiresIn = this.configService.get('JWT_EXPIRES_IN')
    const jwtRefreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN')

    const jwt = this.authTokenService.generateToken(data, jwtExpiresIn)

    const refreshExpiredAt = Date.now() + +ms(jwtRefreshExpiresIn)
    const jwtExpiredAt = Date.now() + +ms(jwtExpiresIn)
    const refresh = uuid.v4()

    return {
      jwt,
      refresh,
      refreshExpiredAt,
      jwtExpiredAt
    }
  }
}
