## Backend Coding Challenge

In this challenge, i'm implement commands that allow a user to create, move and delete directories.

### Start

Just run `yarn install` and then `yarn start` for running program.
The list of commands is taken from the `commands.txt` file. Also you can use another file (just pass the path to the file as the first argument `ts-node src/index filename`)

### Commands list

- `CREATE dirname/another-dir` - Creates a new directory and all subdirectories
- `LIST` - Lists all directories to the console
- `MOVE dirname-a dirname-b ` - Move a folder with all subdirectories to another folder. If any of the directories does not exist, it will return an error.
- `DELETE dirname` - Removes a directory with all subdirectories. If the directory does not exist will return an error

### Env variables

- `CASE_SENSITIVE` - Case sensitive commands. `Default false.`
- `PRINT_COMMANDS` - Print all commands to console. `Default true.`
- `THROW_ERRORS` - If an error occurs in any command, it will immediately terminate the execution of the program. `Default false.`