import { HttpStatus } from '@nestjs/common'
import { EXCEPTION_CODES } from '../codes'
import { BaseException } from './base.exception'

export class BadRequestCustomException extends BaseException {
  constructor(code?: string, description?: string) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      code: code || EXCEPTION_CODES.BAD_REQUEST,
      description
    })
  }
}
