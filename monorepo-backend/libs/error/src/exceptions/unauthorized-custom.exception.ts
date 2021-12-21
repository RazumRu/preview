import { HttpStatus } from '@nestjs/common'
import { EXCEPTION_CODES } from '../codes'
import { BaseException } from './base.exception'

export class UnauthorizedCustomException extends BaseException {
  constructor(code?: string, description?: string) {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      code: code || EXCEPTION_CODES.UNAUTHORIZED,
      description
    })
  }
}
