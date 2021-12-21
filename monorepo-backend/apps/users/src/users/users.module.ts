import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
  controllers: [],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ]
})
export class UsersModule {}
