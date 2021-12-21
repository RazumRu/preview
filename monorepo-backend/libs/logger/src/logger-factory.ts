import { Logger } from '@passed-way/logger/logger'
import { ILoggerParams } from '@passed-way/logger/logger.types'

export const loggerFactory = (params: ILoggerParams) => {
  const logger = new Logger()
  logger.init(params)

  if (params.sentryDsn) {
    logger.initSentry(params.sentryDsn)
  }

  return logger
}
