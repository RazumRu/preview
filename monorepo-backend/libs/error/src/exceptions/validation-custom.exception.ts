import { HttpStatus } from '@nestjs/common'
import { EXCEPTION_CODES } from '../codes'
import { IFieldError } from '../error.types'
import { BaseException } from './base.exception'

export class ValidationCustomException extends BaseException {
  constructor(
    code?: string,
    description?: string,
    public fields?: IFieldError[]
  ) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      code: code || EXCEPTION_CODES.VALIDATION_ERROR,
      description,
      fields
    })
  }
}
