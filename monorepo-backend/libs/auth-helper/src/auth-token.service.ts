import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UnauthorizedCustomException } from '@passed-way/error'
import { Logger } from '@passed-way/logger'
import jsonwebtoken, { SignOptions } from 'jsonwebtoken'

@Injectable()
export class AuthTokenService {
  constructor(
    private configService: ConfigService,
    private readonly logger: Logger
  ) {}

  public generateToken<T = any>(data: T, expiresIn?: string): string {
    const opt: SignOptions = {}

    if (expiresIn) {
      opt.expiresIn = expiresIn
    }

    return jsonwebtoken.sign(data as any, this.getSecretKey(), opt)
  }

  public parseToken<T = any>(token: string): T {
    try {
      const payload = jsonwebtoken.verify(token as string, this.getSecretKey())
      return payload as unknown as T
    } catch (err) {
      this.logger.error(err as Error, {
        token
      })
      throw new UnauthorizedCustomException()
    }
  }

  private getSecretKey(): string {
    return this.configService.get('JWT_SECRET_KEY') || ''
  }
}
