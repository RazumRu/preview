export interface ILoggerParams {
  environment: string
  appName: string
  appVersion: string
  prettyPrint?: boolean
  sentryDsn?: string
}

export interface ISentryLogData {
  data?: any
  userId?: string
  requestId?: string
  operationId?: string
  error?: {
    code: string
    statusCode: number
    message: string
    [key: string]: any
  }
}
