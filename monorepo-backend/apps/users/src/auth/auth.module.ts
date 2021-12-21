import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './services/auth.service'
import { SessionService } from './services/session.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionService],
  imports: [
    UsersModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_URL')
      }),
      inject: [ConfigService]
    })
  ],
  exports: [UsersModule]
})
export class AuthModule {}
