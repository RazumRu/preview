import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
  ExpressAdapter,
  NestExpressApplication
} from '@nestjs/platform-express'
import { AppModule } from '@passed-way/app-bootstrapper/app.module'
import { AllExceptionsFilter, CustomValidationPipe } from '@passed-way/error'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from '@passed-way/logger'
import * as path from 'path'
import { IBootstrapOptions } from './app.types'
import helmet from 'helmet'

export { IBootstrapOptions }

export const bootstrap = async (param: IBootstrapOptions) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(param),
    new ExpressAdapter()
  )
  const logger = app.get(Logger)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalFilters(new AllExceptionsFilter(logger))
  app.enableCors()
  app.use(helmet({ contentSecurityPolicy: false }))

  const globalPrefix = configService.get('GLOBAL_PATH_PREFIX')
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix)
  }

  app.useLogger(logger)

  // swagger
  const swaggerPath = configService.get('SWAGGER_PATH') || ''

  if (swaggerPath) {
    const config = new DocumentBuilder()
      .setTitle(param.appName)
      .setDescription(param.appDescription)
      .setVersion(param.appVersion)
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey
      // ignoreGlobalPrefix: true
    })
    const swp = path.join(globalPrefix || '', swaggerPath)
    SwaggerModule.setup(swp, app, document)

    logger.log(`Swagger runs on ${swp}`)
  }

  const port = param.port || 3000
  await app.listen(port, '0.0.0.0')

  logger.log(
    `Server ${param.appName} listen on ${port} (${param.env}, ${param.appVersion})`,
    {
      globalPrefix,
      param
    }
  )
}
