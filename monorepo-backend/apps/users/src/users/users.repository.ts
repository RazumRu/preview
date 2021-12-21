import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async createUser(data: User): Promise<UserDocument> {
    const createdUser = await this.userModel.create(data)
    return createdUser
  }

  public async updateUserById(
    id: string,
    data: Partial<User>
  ): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(
      {
        _id: id
      },
      data,
      {
        new: true
      }
    )
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email
    })
  }

  public async getUserById(id: string, projection?: string) {
    const userQuery = this.userModel.findById(id)

    if (projection) {
      userQuery.select(projection)
    }

    return userQuery.lean().exec()
  }
}
