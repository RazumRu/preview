export interface IBootstrapOptions {
  appModule: any
  env: string
  envFilesPath: string
  appVersion: string
  appName: string
  appDescription: string
  port?: number
}

export const NODE_ENV = {
  development: 'development',
  production: 'production'
}
