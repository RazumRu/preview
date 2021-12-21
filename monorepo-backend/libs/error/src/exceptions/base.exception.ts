import { EXCEPTION_CODE_MESSAGES } from '../code-messages'
import { IFieldError } from '../error.types'
import * as _ from 'lodash'

export class BaseException extends Error {
  public isBaseError = true

  constructor(
    public data: {
      statusCode: number
      code: string
      description?: string
      fields?: IFieldError[]
    }
  ) {
    super()
    this.message = this.getFullMessage()
  }

  private get lang(): keyof typeof EXCEPTION_CODE_MESSAGES {
    return (process.env.LANG || 'en').toUpperCase() as any
  }

  public getMessage() {
    return (
      this.data.description ||
      _.get(EXCEPTION_CODE_MESSAGES[this.lang], this.data.code, this.data.code)
    )
  }

  public getFullMessage() {
    let msg = this.getMessage()
    msg = `[${this.data.code}] ${msg}`

    return this.data.fields
      ? `${msg}: ${this.data.fields
          .map((f) => `${f.name} - ${f.message}`)
          .join(', ')}`
      : msg
  }
}
