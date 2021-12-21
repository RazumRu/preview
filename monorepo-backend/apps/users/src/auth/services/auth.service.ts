import { Injectable } from '@nestjs/common'
import { EXCEPTION_CODES, ValidationCustomException } from '@passed-way/error'
import { UsersService } from '../../users/users.service'
import { LoginDto } from '../dto/login.dto'
import { TokenDataDto } from '../dto/token-data.dto'
import { SessionService } from './session.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService
  ) {}

  public async login(data: LoginDto): Promise<TokenDataDto> {
    const user = await this.usersService.getUserByEmail(data.email)

    const checkPassword = await this.usersService.checkPass(
      user.password,
      data.password
    )

    if (!checkPassword) {
      throw new ValidationCustomException(EXCEPTION_CODES.PASSWORD_INCORRECT)
    }

    const sessionData = await this.sessionService.createSession({
      userId: String(user._id)
    })

    return sessionData.tokenData
  }
}
