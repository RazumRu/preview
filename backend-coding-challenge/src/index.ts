import path from 'path'
import { CommandSearcher } from './modules/command-searcher'
import { FsManagerFake } from './modules/fs-manager'
import yn from 'to-boolean'

const run = async (args: string[]) => {
  const filePath = args[0]
  const fullFilePath = path.resolve(filePath)
  const commandSearcher = new CommandSearcher({
    caseSensitive: yn(process.env.CASE_SENSITIVE || ''),
    printCommands: yn(process.env.PRINT_COMMANDS || '1'),
    throwErrors: yn(process.env.THROW_ERRORS || '')
  })
  // we can use inversify, later
  const fsManager = new FsManagerFake()

  if (!filePath) {
    throw Error('Path to file is not passed')
  }

  // add commands
  {
    commandSearcher
      .addCommand('CREATE', fsManager.createDir.bind(fsManager))
      .addCommand('LIST', fsManager.printDirs.bind(fsManager))
      .addCommand('MOVE', fsManager.moveDir.bind(fsManager))
      .addCommand('DELETE', fsManager.deleteDir.bind(fsManager))
  }

  await commandSearcher.runCommandsFromFile(fullFilePath)
}

run(process.argv.slice(2)).catch((err) => {
  console.error(err)
  process.exit(-1)
})
