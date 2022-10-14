import yargs = require("yargs");
import { CliCommand } from "../../module_cli/types/cliCommand";
import run from './run';

export default [{
    command: 'svc run',
    showInHelp: '- run http service',
    builder: (yargs)=>{
        yargs.positional('listen-http', {
            describe: "HTTP ip/port binding (ip:port)",
            default:false
        });
        yargs.positional('listen-unix', {
            describe: "Unix socket path to listen to",
            default: false
        })
    },
    handler: run,
    middlewares: [],
    deprecated: false,

}] as CliCommand[];