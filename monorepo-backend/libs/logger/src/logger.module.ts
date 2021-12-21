import { DynamicModule, Global, Module } from '@nestjs/common'
import {
  IBootstrapOptions,
  NODE_ENV
} from '@passed-way/app-bootstrapper/app.types'
import { Logger, loggerFactory } from '@passed-way/logger'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: []
})
export class LoggerModule {
  static forRoot(param: IBootstrapOptions): DynamicModule {
    const logger = loggerFactory({
      environment: param.env,
      appName: param.appName,
      appVersion: param.appVersion,
      sentryDsn: process.env.SENTRY_DSN,
      prettyPrint: param.env === NODE_ENV.development
    })

    return {
      module: LoggerModule,
      exports: [Logger],
      providers: [
        {
          provide: Logger,
          useValue: logger
        }
      ]
    }
  }
}
