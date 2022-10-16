import { CliCommand } from "../../module_cli/types/cliCommand";
import { cli_app } from "./cli_app";

export default [
{
    command: 'app',
    showInHelp: '',
    builder: (yargs)=>{},
    handler: cli_app,
    middlewares: [],
    deprecated: false,

}] as CliCommand[];