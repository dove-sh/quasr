import yargs = require("yargs");

interface CliModule{
    cliCommands: CliCommand[]
}
interface CliCommand{
    command: string | readonly string[],
    showInHelp: string,
    builder?: yargs.BuilderCallback<{}, {}>,
    handler?: (args: yargs.ArgumentsCamelCase<{}>) => void | Promise<void>,
    middlewares?: yargs.MiddlewareFunction<{}>[],
    deprecated?: string | boolean
}