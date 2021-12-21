import { CACHE_MANAGER } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthTokenService } from '@passed-way/auth-helper'
import { EXCEPTION_CODES } from '@passed-way/error'
import { Logger } from '@passed-way/logger'
import { Cache } from 'cache-manager'
import { createMock } from '@golevelup/ts-jest'
import { SessionService } from '../services/session.service'

describe(SessionService, () => {
  let service: SessionService

  beforeEach(async () => {
    const fakeStorage = new Map()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        ConfigService,
        AuthTokenService,
        {
          provide: Logger,
          useValue: createMock<Logger>()
        },
        {
          provide: CACHE_MANAGER,
          useValue: createMock<Cache>({
            async set(key: string, val: unknown) {
              fakeStorage.set(key, val)
            },

            async get(key: string) {
              return fakeStorage.get(key)
            },

            async del(key: string) {
              fakeStorage.delete(key)
            }
          })
        }
      ]
    }).compile()

    service = module.get<SessionService>(SessionService)
    jest
      .spyOn(module.get(ConfigService), 'get')
      .mockImplementation((key: string) => {
        if (key === 'JWT_SECRET_KEY') {
          return 'JWT_SECRET_KEY'
        }

        if (key === 'JWT_EXPIRES_IN') {
          return '15m'
        }

        if (key === 'JWT_REFRESH_EXPIRES_IN') {
          return '15m'
        }

        return undefined
      })
  })

  describe('createSession', () => {
    it('should create session', async () => {
      const userId = '123'
      const data = await service.createSession({
        userId
      })
      expect(data).toBeTruthy()

      expect(data.sessionData.userId).toEqual(userId)
      expect(data.sessionData.uuid).toBeString()
      expect(data.sessionData.expiredAt).toBeNumber()

      expect(data.tokenData.jwt).toBeString()
      expect(data.tokenData.refresh).toBeString()
      expect(data.tokenData.refreshExpiredAt).toBeNumber()
      expect(data.tokenData.jwtExpiredAt).toBeNumber()
    })
  })

  describe('refreshSession', () => {
    it('should refresh session', async () => {
      const userId = '123'
      const session = await service.createSession({
        userId
      })
      expect(session).toBeTruthy()

      const refresh = await service.refreshSession(session.tokenData.refresh)
      expect(refresh).toBeTruthy()

      expect(refresh.sessionData.userId).toEqual(userId)
      expect(refresh.sessionData.uuid).toBeString()
      expect(refresh.sessionData.uuid).not.toEqual(session.sessionData.uuid)
      expect(refresh.sessionData.expiredAt).toBeNumber()
      expect(refresh.sessionData.expiredAt).not.toEqual(
        session.sessionData.expiredAt
      )

      expect(refresh.tokenData.jwt).toBeString()
      // expect(refresh.tokenData.jwt).not.toEqual(session.tokenData.jwt)
      expect(refresh.tokenData.refresh).toBeString()
      expect(refresh.tokenData.refresh).not.toEqual(session.tokenData.refresh)
      expect(refresh.tokenData.refreshExpiredAt).toBeNumber()
      expect(refresh.tokenData.refreshExpiredAt).not.toEqual(
        session.tokenData.refreshExpiredAt
      )
      expect(refresh.tokenData.jwtExpiredAt).toBeNumber()
      expect(refresh.tokenData.jwtExpiredAt).not.toEqual(
        session.tokenData.jwtExpiredAt
      )
    })

    it('should throw NOT_FOUND error', async () => {
      await expect(
        service.refreshSession('unknown')
      ).rejects.toThrowWithMessage(
        Error,
        new RegExp(EXCEPTION_CODES.NOT_FOUND, 'ig')
      )
    })
  })
})
