import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus
} from '@nestjs/common'
import { Logger } from '@passed-way/logger'
import { BaseException } from '../exceptions/base.exception'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const statusCode =
      exception instanceof BaseException
        ? exception.data.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR

    const code =
      exception instanceof BaseException
        ? exception.data.code
        : 'INTERNAL_SERVER_ERROR'

    const message =
      exception instanceof BaseException
        ? exception.getMessage()
        : exception.message

    const fullMessage =
      exception instanceof BaseException
        ? exception.getFullMessage()
        : exception.message

    const fields =
      exception instanceof BaseException ? exception.data.fields : []

    const resp = {
      statusCode,
      code,
      message,
      fullMessage,
      fields
    }
    this.logger.error(message, resp, {
      url: request.url,
      headers: request.headers,
      body: request.body
    })

    response.status(statusCode).send(resp)
  }
}
