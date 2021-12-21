/**
 * Parsing commands from a string and performing specific actions
 */
export interface ICommandSearcher {
  /**
   * Add some command to collection.
   * When adding a command with the same name (case insensitive), it will be overwritten
   * @param name command name
   * @param cb callback with some arguments
   */
  addCommand(name: string, cb: CommandCallback): ICommandSearcher

  /**
   * Get created commands
   */
  getCommands(): Map<string, ICommandTemplate>

  /**
   * Parse command body, if it's exists
   * @param line command body
   */
  parseCommandLine(line: string): ICommand | null

  /**
   * Reads commands line by line from a file
   * @param path full path to some file
   */
  parseCommandsFromFile(path: string): Promise<ICommand[]>

  /**
   * Reads and runs commands line by line from a file
   * @param path full path to some file
   */
  runCommandsFromFile(path: string): Promise<ICommandResult[]>
}

export type CommandCallback = (...args: string[]) => Promise<any>

export interface ICommand {
  name: string
  cb: CommandCallback
  body: string
  args: string[]
}

export interface ICommandResult {
  command: ICommand
  result: any
  error?: Error
}

export interface ICommandTemplate {
  name: string
  cb: CommandCallback
}

export interface ICommandSearcherParams {
  /**
   * Determines whether commands will be read case sensitive
   * @default false
   */
  caseSensitive?: boolean

  /**
   * Print all commands
   * @default false
   */
  printCommands?: boolean

  /**
   * Throw first error or just log it
   * @default true
   */
  throwErrors?: boolean
}
