import { bootstrap } from '@passed-way/app-bootstrapper'
import * as path from 'path'
import { AppModule } from './app.module'

bootstrap({
  appModule: AppModule,
  appVersion: '1.0',
  appName: 'Users',
  appDescription: 'Users api',
  env: process.env.NODE_ENV || 'production',
  port: +String(process.env.HTTP_PORT) || 5001,
  envFilesPath: path.resolve(__dirname, '..')
}).catch((err: Error) => {
  console.error({ err }, "Server didn't start, something went wrong 💔")

  setTimeout(process.exit, 1000, 1)
})
