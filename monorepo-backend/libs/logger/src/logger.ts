import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common'
import { ILoggerParams, ISentryLogData } from '@passed-way/logger/logger.types'
import * as _ from 'lodash'
import P from 'pino'
import * as Sentry from '@sentry/node'

@Injectable()
export class Logger extends ConsoleLogger implements LoggerService {
  private pino: P.Logger
  private params: ILoggerParams

  constructor() {
    super()
  }

  public init(params: ILoggerParams) {
    this.params = params
    this.pino = P({
      transport: params.prettyPrint
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true
            }
          }
        : undefined,
      name: params.appName
    })
  }

  private buildPayload(msg: string | Error, level: string, ...args: any[]) {
    const message = _.isString(msg) ? msg : msg.message

    return _.pickBy(
      {
        msg: message,
        error: !_.isString(msg) ? msg : undefined,
        level,
        environment: this.params.environment,
        appName: this.params.appName,
        appVersion: this.params.appVersion,
        data: args.reduce((acc: any, curr: any) => {
          if (_.isObject(curr)) {
            for (const i in curr) {
              acc[i] = (<any>curr)[i]
            }
          } else {
            if (!acc._args) {
              acc._args = []
            }
            acc._args.push(curr)
          }

          return acc
        }, {})
      },
      (v) => !_.isUndefined(v)
    )
  }

  public getPino() {
    return this.pino
  }

  public debug(msg: string, ...args: any[]): any {
    return this.pino.debug(this.buildPayload(msg, 'debug', ...args))
  }

  public error(err: Error | string, ...args: any[]): any {
    return this.pino.error(this.buildPayload(err, 'error', ...args))
  }

  public sentryError(err: Error, data: ISentryLogData): any {
    Sentry.configureScope((scope: Sentry.Scope) => {
      const dataToJSON = (formatData: any): string => {
        if (_.isObject(formatData)) {
          try {
            formatData = JSON.stringify(formatData)
          } catch (_) {
            return String(formatData)
          }

          // eslint-disable-next-line max-len
          // https://docs.sentry.io/enriching-error-data/context/?platform=javascript#extra-context
          if (Buffer.byteLength(formatData, 'utf8') > 200 * 1000) {
            formatData = formatData.substr(0, 200 * 1000)
          }
        }

        return String(formatData)
      }

      if (_.isObject(data.data)) {
        scope.setExtra('data', dataToJSON(data.data))

        if (data.userId) {
          scope.setUser({
            userID: data.userId,
            username: String(data.userId)
          })
        }

        if (data.requestId) {
          scope.setTag('requestId', data.requestId)
        }

        if (data.operationId) {
          scope.setTag('requestId', data.operationId)
        }

        if (data.error) {
          scope.setExtra('error', data.error)
          scope.setTag('code', data.error.code)
          scope.setTag('statusCode', data.error.statusCode)
          scope.setLevel(Sentry.Severity.Error)
        } else {
          scope.setLevel(Sentry.Severity.Info)
        }
      }

      Sentry.captureException(err)
    })
  }

  public log(msg: string, ...args: any[]): any {
    return this.pino.info(this.buildPayload(msg, 'info', ...args))
  }

  public verbose(msg: string, ...args: any[]): any {
    return this.pino.trace(this.buildPayload(msg, 'verbose', ...args))
  }

  public warn(msg: string, ...args: any[]): any {
    return this.pino.warn(this.buildPayload(msg, 'warn', ...args))
  }

  public initSentry(dsn: string) {
    Sentry.init({
      environment: this.params.environment,
      dsn,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: (err) => {
            this.error(err, 'Uncaught exception')
            setTimeout(() => process.exit(1), 10)
          }
        }),
        // unfortunately, sentry does not provide a way to add additional tags to record,
        // that can be useful to track records within whole application
        new Sentry.Integrations.OnUnhandledRejection()
      ]
    })
  }
}
