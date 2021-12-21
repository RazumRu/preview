import { Test, TestingModule } from '@nestjs/testing'
import { EXCEPTION_CODES } from '@passed-way/error'
import { UsersService } from '../../users/users.service'
import { AuthService } from '../services/auth.service'
import { createMock } from '@golevelup/ts-jest'
import { SessionService } from '../services/session.service'

describe(AuthService, () => {
  let service: AuthService

  const mockUser = {
    email: 'email',
    password: 'password'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: createMock<UsersService>({
            async getUserByEmail() {
              return mockUser as any
            },

            async checkPass(_, pass: string) {
              return mockUser.password === pass
            }
          })
        },
        {
          provide: SessionService,
          useValue: createMock<SessionService>({
            async createSession() {
              return {
                tokenData: {}
              } as any
            }
          })
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  describe('login', () => {
    it('should login', async () => {
      const data = await service.login(mockUser)
      expect(data).toBeTruthy()
    })

    it('should throw PASSWORD_INCORRECT error', async () => {
      await expect(
        service.login({
          email: mockUser.email,
          password: 'incorrect'
        })
      ).rejects.toThrowWithMessage(
        Error,
        new RegExp(EXCEPTION_CODES.PASSWORD_INCORRECT, 'ig')
      )
    })
  })
})
