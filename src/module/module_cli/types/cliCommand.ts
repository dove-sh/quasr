import yargs from "yargs";

export interface CliModule{
    cliCommands: CliCommand[]
}
export interface CliCommand{
    command: string | readonly string[],
    showInHelp: string,
    builder?: yargs.BuilderCallback<{}, {}>,
    handler?: (args: yargs.ArgumentsCamelCase<{}>) => void | Promise<void>,
    middlewares?: yargs.MiddlewareFunction<{}>[],
    deprecated?: string | boolean
}

export interface CliFunction{
    (command: string, handler: (args:any)=>any, showInHelp?:string, builder?:(yargs: yargs.Argv<{}>)=>any):any
}
export interface CliFunctionContext{
    cli: CliFunction
    [key: string]:any;
}