import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { RefreshDto } from './dto/refresh.dto'
import { TokenDataDto } from './dto/token-data.dto'
import { AuthService } from './services/auth.service'
import { SessionService } from './services/session.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService
  ) {}

  @Post('/login')
  @ApiOperation({
    description: 'Login'
  })
  public async login(@Body() data: LoginDto): Promise<TokenDataDto> {
    return this.authService.login(data)
  }

  @Post('/refresh')
  @ApiOperation({
    description: 'Refresh auth token'
  })
  public async refresh(@Body() data: RefreshDto): Promise<TokenDataDto> {
    const session = await this.sessionService.refreshSession(data.token)
    return session.tokenData
  }
}
