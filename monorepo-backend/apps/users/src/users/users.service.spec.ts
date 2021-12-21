import { Test, TestingModule } from '@nestjs/testing'
import { EXCEPTION_CODES } from '@passed-way/error'
import { createMock } from '@golevelup/ts-jest'
import * as faker from 'faker'
import { User } from './schemas/user.schema'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

describe(UsersService, () => {
  let service: UsersService

  beforeEach(async () => {
    const users: any = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: createMock<UsersRepository>({
            async createUser(data: User) {
              const u = {
                ...data,
                _id: faker.datatype.uuid()
              }
              users[u._id] = u

              return u as any
            },

            async getUserById(id: string) {
              return users[id] || null
            },

            async getUserByEmail(email: string) {
              return (
                (Object.values(users).find(
                  (u: any) => u.email === email
                ) as any) || null
              )
            }
          })
        }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  describe('createUser', () => {
    it('should create new user', async () => {
      const user: User = {
        email: 'email',
        password: 'password'
      }

      const createdUser = await service.createUser(user)
      expect(createdUser).toMatchObject(user)
    })
  })

  describe('getUserById', () => {
    it('should get user', async () => {
      const user: User = {
        email: 'email',
        password: 'password'
      }

      const createdUser = await service.createUser(user)
      expect(createdUser).toMatchObject(user)

      const getUserResult = await service.getUserById(createdUser._id)
      expect(getUserResult).toMatchObject(user)
    })

    it('should throw USER_NOT_FOUND error', async () => {
      await expect(service.getUserById('unknown')).rejects.toThrowWithMessage(
        Error,
        new RegExp(EXCEPTION_CODES.USER_NOT_FOUND, 'ig')
      )
    })
  })

  describe('getUserByEmail', () => {
    it('should get user', async () => {
      const user: User = {
        email: 'email',
        password: 'password'
      }

      const createdUser = await service.createUser(user)
      expect(createdUser).toMatchObject(user)

      const getUserResult = await service.getUserByEmail(createdUser.email)
      expect(getUserResult).toMatchObject(user)
    })

    it('should throw USER_NOT_FOUND error', async () => {
      await expect(service.getUserByEmail('unknown')).rejects.toThrowError(
        EXCEPTION_CODES.USER_NOT_FOUND
      )
    })
  })

  describe('encryptPass', () => {
    it('should encrypt pass', async () => {
      const pass = 'pass'

      const encryptedPass = await service.encryptPass(pass)
      expect(encryptedPass).toBeString()
      expect(encryptedPass).not.toEqual(pass)
    })
  })

  describe('checkPass', () => {
    it('should compare pass and return true', async () => {
      const pass = 'pass'

      expect(
        await service.checkPass(await service.encryptPass(pass), pass)
      ).toBeTruthy()
    })

    it('should compare pass and return false', async () => {
      const pass = 'pass'

      expect(
        await service.checkPass(
          await service.encryptPass(pass),
          await service.encryptPass('passs')
        )
      ).toBeFalse()
    })
  })
})
