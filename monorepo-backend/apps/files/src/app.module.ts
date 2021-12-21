import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    FilesModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URL')
        }
      },
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
