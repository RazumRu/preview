import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IBootstrapOptions } from '@passed-way/app-bootstrapper/app.types'
import { AppLoggerMiddleware } from './log.middleware'
import { AuthHelperModule } from '@passed-way/auth-helper'
import { HealthCheckerModule } from '@passed-way/health-checker'
import { LoggerModule } from '@passed-way/logger/logger.module'
import * as path from 'path'

@Module({
  imports: [],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }

  static forRoot(param: IBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        HealthCheckerModule,
        AuthHelperModule,
        LoggerModule.forRoot(param),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            path.resolve(param.envFilesPath, `.env`),
            path.resolve(param.envFilesPath, `.env.${param.env}`)
          ]
        }),
        param.appModule
      ],
      controllers: [],
      exports: []
    }
  }
}
