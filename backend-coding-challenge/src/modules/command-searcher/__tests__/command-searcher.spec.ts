import 'jest-extended'
import { CommandSearcher } from '../command-searcher'
import path from 'path'
import { ICommandSearcherParams } from '../command-searcher.types'

const getCommandSearcherInstance = (params?: ICommandSearcherParams) => {
  return new CommandSearcher(params)
}

describe('command-searcher', () => {
  describe('addCommand', () => {
    it(`should add some commands to collection`, async () => {
      const instance = getCommandSearcherInstance()

      const commandsTpl: any = [
        [
          'a',
          async () => {
            //
          }
        ],
        [
          'b',
          async () => {
            //
          }
        ]
      ]

      for (const [commandName, cb] of commandsTpl) {
        instance.addCommand(commandName, cb)
      }

      // check command
      const commands = instance.getCommands()
      expect(commands.size).toEqual(commandsTpl.length)

      for (const [commandName, cb] of commandsTpl) {
        const cmd = commands.get(commandName.toLowerCase())
        expect(cmd).toBeTruthy()
        expect(cmd?.name).toEqual(commandName)
        expect(cmd?.cb).toEqual(cb)
      }
    })

    it(`should replace command in collection with same key`, async () => {
      const instance = getCommandSearcherInstance()

      const commandName = 'TEST'
      const cbA = async () => {
        //
      }
      const cbB = async () => {
        //
      }

      instance
        .addCommand(commandName.toLowerCase(), cbA)
        .addCommand(commandName, cbB)

      // check command
      const commands = instance.getCommands()
      expect(commands.size).toEqual(1)

      const cmd = commands.get(commandName.toLowerCase())
      expect(cmd).toBeTruthy()
      expect(cmd?.name).toEqual(commandName)
      expect(cmd?.cb).toEqual(cbB)
    })
  })

  describe('parseCommandsFromFile', () => {
    it('should parse file and returns some commands', async () => {
      const instance = getCommandSearcherInstance()

      const commandsTpl: any = [
        [
          'CREATE',
          async () => {
            //
          }
        ],
        [
          'DELETE',
          async () => {
            //
          }
        ]
      ]

      for (const [name, cb] of commandsTpl) {
        instance.addCommand(name, cb)
      }

      const commands = await instance.parseCommandsFromFile(
        path.resolve(__dirname, 'assets/test-commands.txt')
      )

      expect(commands).toBeArrayOfSize(3)

      expect(commands[0].name).toEqual(commandsTpl[0][0])
      expect(commands[0].cb).toEqual(commandsTpl[0][1])
      expect(commands[0].body).toEqual('CREATE a')
      expect(commands[0].args).toEqual(['a'])

      expect(commands[1].name).toEqual(commandsTpl[0][0])
      expect(commands[1].cb).toEqual(commandsTpl[0][1])
      expect(commands[1].body).toEqual('CREATE b/c')
      expect(commands[1].args).toEqual(['b/c'])

      expect(commands[2].name).toEqual(commandsTpl[1][0])
      expect(commands[2].cb).toEqual(commandsTpl[1][1])
      expect(commands[2].body).toEqual('DELETE b/c')
      expect(commands[2].args).toEqual(['b/c'])
    })

    it('should throw error if file not found', async () => {
      const instance = getCommandSearcherInstance()

      await expect(
        instance.parseCommandsFromFile(path.resolve(__dirname, 'unknown'))
      ).rejects.toThrowWithMessage(Error, /not found/)
    })
  })

  describe('runCommandsFromFile', () => {
    it('should parse file and runs some commands', async () => {
      const instance = getCommandSearcherInstance()

      let isDeleted = false
      const commandsTpl: any = [
        [
          'CREATE',
          async (path: string) => {
            return path
          }
        ],
        [
          'DELETE',
          async () => {
            isDeleted = true
          }
        ]
      ]

      for (const [name, cb] of commandsTpl) {
        instance.addCommand(name, cb)
      }

      const commands = await instance.runCommandsFromFile(
        path.resolve(__dirname, 'assets/test-commands.txt')
      )

      expect(commands).toBeArrayOfSize(3)

      expect(commands[0].command.name).toEqual(commandsTpl[0][0])
      expect(commands[0].error).toBeFalsy()
      expect(commands[0].result).toEqual('a')

      expect(commands[1].command.name).toEqual(commandsTpl[0][0])
      expect(commands[1].error).toBeFalsy()
      expect(commands[1].result).toEqual('b/c')

      expect(commands[2].command.name).toEqual(commandsTpl[1][0])
      expect(commands[2].error).toBeFalsy()
      expect(commands[2].result).toBeFalsy()
      expect(isDeleted).toBeTrue()
    })

    it('should return error if it happens inside callback (with throwErrors flag)', async () => {
      const instance = getCommandSearcherInstance({
        throwErrors: false
      })
      const err = new Error('Deleted error')

      const commandsTpl: any = [
        [
          'DELETE',
          async () => {
            throw err
          }
        ]
      ]

      for (const [name, cb] of commandsTpl) {
        instance.addCommand(name, cb)
      }

      const commands = await instance.runCommandsFromFile(
        path.resolve(__dirname, 'assets/test-commands.txt')
      )

      expect(commands).toBeArrayOfSize(1)

      expect(commands[0].command.name).toEqual(commandsTpl[0][0])
      expect(commands[0].result).toBeFalsy()
      expect(commands[0].error).toEqual(err)
    })

    it('should throw error if it happens inside callback', async () => {
      const instance = getCommandSearcherInstance()
      const err = new Error('Deleted error')

      const commandsTpl: any = [
        [
          'DELETE',
          async () => {
            throw err
          }
        ]
      ]

      for (const [name, cb] of commandsTpl) {
        instance.addCommand(name, cb)
      }

      await expect(
        instance.runCommandsFromFile(
          path.resolve(__dirname, 'assets/test-commands.txt')
        )
      ).rejects.toThrowWithMessage(Error, err.message)
    })

    it('should throw error if file not found', async () => {
      const instance = getCommandSearcherInstance()

      await expect(
        instance.runCommandsFromFile(path.resolve(__dirname, 'unknown'))
      ).rejects.toThrowWithMessage(Error, /not found/)
    })
  })

  describe('parseCommandLine', () => {
    it('should correctly parse some commands', async () => {
      const instance = getCommandSearcherInstance()

      const commandName = 'TEST'
      const cb = async () => {
        //
      }
      instance.addCommand(commandName, cb)

      const args = ['a', 'b']
      const commandBody = `${commandName} ${args.join(' ')}`
      const line = await instance.parseCommandLine(commandBody)

      expect(line?.name).toEqual(commandName)
      expect(line?.cb).toEqual(cb)
      expect(line?.body).toEqual(commandBody)
      expect(line?.args).toEqual(args)
    })

    it('should correctly parse some commands with different format', async () => {
      const instance = getCommandSearcherInstance({
        caseSensitive: false
      })

      const commandNames = ['TEST', 'TEST2']
      const cb = async () => {
        //
      }

      instance.addCommand(commandNames[0], cb)
      instance.addCommand(commandNames[1], cb)

      // space
      {
        const line = await instance.parseCommandLine(` ${commandNames[0]}`)

        expect(line?.name).toEqual(commandNames[0])
        expect(line?.cb).toEqual(cb)
      }

      // caseSensitive false
      {
        const line = await instance.parseCommandLine(
          commandNames[1].toLowerCase()
        )

        expect(line?.name).toEqual(commandNames[1])
        expect(line?.cb).toEqual(cb)
      }
    })

    it('should not parse some commands with caseSensitive', async () => {
      const instance = getCommandSearcherInstance({
        caseSensitive: true
      })

      const commandName = 'TEST'
      const cb = async () => {
        //
      }

      instance.addCommand(commandName, cb)

      const line = await instance.parseCommandLine(commandName.toLowerCase())

      expect(line).toBeFalsy()
    })
  })
})
