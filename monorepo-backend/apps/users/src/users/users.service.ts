import { Injectable } from '@nestjs/common'
import { EXCEPTION_CODES, NotFoundCustomException } from '@passed-way/error'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from './schemas/user.schema'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  public async createUser(data: User): Promise<UserDocument> {
    data.password = await this.encryptPass(data.password)
    return this.usersRepository.createUser(data)
  }

  public async getUserById(id: string, projection?: string) {
    const user = await this.usersRepository.getUserById(id, projection)

    if (!user) {
      throw new NotFoundCustomException(EXCEPTION_CODES.USER_NOT_FOUND)
    }

    return user
  }

  public async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.usersRepository.getUserByEmail(email)

    if (!user) {
      throw new NotFoundCustomException(EXCEPTION_CODES.USER_NOT_FOUND)
    }

    return user
  }

  public async encryptPass(pass: string): Promise<string> {
    return bcrypt.hash(pass, 10)
  }

  public async checkPass(hash: string, pass: string): Promise<boolean> {
    return bcrypt.compare(pass, hash)
  }
}
