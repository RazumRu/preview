import {
  CommandCallback,
  ICommand,
  ICommandResult,
  ICommandSearcher,
  ICommandSearcherParams,
  ICommandTemplate
} from './command-searcher.types'
import * as readline from 'readline'
import * as fs from 'fs-extra'

export class CommandSearcher implements ICommandSearcher {
  private readonly commands: Map<string, ICommandTemplate> = new Map()

  constructor(private readonly params?: ICommandSearcherParams) {}

  public addCommand(name: string, cb: CommandCallback): CommandSearcher {
    this.commands.set(name.toLowerCase(), {
      cb,
      name
    })

    return this
  }

  public getCommands() {
    return this.commands
  }

  public async parseCommandsFromFile(path: string): Promise<ICommand[]> {
    if (!(await fs.pathExists(path))) {
      throw Error(`File ${path} not found`)
    }

    const rl = readline.createInterface({
      input: fs.createReadStream(path)
    })

    const res: ICommand[] = []
    for await (const line of rl) {
      const cmd = this.parseCommandLine(line)

      if (cmd) {
        res.push(cmd)
      }
    }

    return res
  }

  public async runCommandsFromFile(path: string): Promise<ICommandResult[]> {
    const commands = await this.parseCommandsFromFile(path)
    const res: ICommandResult[] = []

    for (const c of commands) {
      if (this.params?.printCommands) {
        console.log(c.body)
      }

      const throwErrors =
        this.params?.throwErrors === undefined ? true : this.params?.throwErrors

      try {
        const data = await c.cb(...c.args)

        res.push({
          command: c,
          result: data
        })
      } catch (e) {
        if (throwErrors) {
          throw e
        } else {
          const { message } = e as Error

          console.error(message)

          res.push({
            command: c,
            result: undefined,
            error: e as Error
          })
        }
      }
    }

    return res
  }

  public parseCommandLine(line: string): ICommand | null {
    const preparedLine = line.trim()

    const commands = this.commands.values()
    for (const cmd of commands) {
      const flags = this.params?.caseSensitive ? '' : 'i'
      const regExp = new RegExp(`^${cmd.name}($|\\s)`, flags)

      if (regExp.test(preparedLine)) {
        return {
          name: cmd.name,
          cb: cmd.cb,
          body: preparedLine,
          args: line
            .replace(new RegExp(`^${cmd.name}`, 'i'), '')
            .trim()
            .split(' ')
        }
      }
    }

    return null
  }
}
