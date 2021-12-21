import { Injectable, NestMiddleware } from '@nestjs/common'
import { Logger } from '@passed-way/logger'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    response.on('finish', () => {
      const { method, ip, originalUrl, body, headers } = request
      const { statusCode } = response

      this.logger.log(`Request ${method}: ${originalUrl}`, {
        method,
        ip,
        headers,
        body,
        url: originalUrl,
        statusCode
      })
    })

    next()
  }
}
