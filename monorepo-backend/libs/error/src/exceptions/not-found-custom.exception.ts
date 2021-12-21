import { HttpStatus } from '@nestjs/common'
import { EXCEPTION_CODES } from '../codes'
import { BaseException } from './base.exception'

export class NotFoundCustomException extends BaseException {
  constructor(code?: string, description?: string) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      code: code || EXCEPTION_CODES.NOT_FOUND,
      description
    })
  }
}
