import { ValidationError, ValidationPipe } from '@nestjs/common'
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe'
import { EXCEPTION_CODES } from '../codes'
import { ValidationCustomException } from '../exceptions/validation-custom.exception'
import { IFieldError } from '../error.types'

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      transform: true,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      skipNullProperties: false,
      exceptionFactory: (...args) => this.getExceptionFactory(...args),
      ...(options || {})
    })
  }

  private getExceptionFactory(errors: ValidationError[]) {
    const findConstraints = (
      errors: ValidationError[],
      path: string,
      constraints: IFieldError[] = []
    ) => {
      for (const err of errors) {
        if (err.constraints) {
          constraints.push(
            ...Object.entries(err.constraints).map((e) => ({
              message: e[1],
              index: e[0],
              name: err.property,
              path: `${path}.${err.property}`.replace(/^\./, ''),
              value: String(err.value)
            }))
          )
        }

        if (err.children) {
          findConstraints(err.children, `${path}.${err.property}`, constraints)
        }
      }

      return constraints
    }

    return new ValidationCustomException(
      EXCEPTION_CODES.VALIDATION_ERROR,
      undefined,
      findConstraints(errors, '')
    )
  }
}
