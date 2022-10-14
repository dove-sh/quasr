import yargs = require("yargs");
import defaultFunction from './default';
import { CliCommand } from "../types/cliCommand";

export default [{
    command: '$0',
    showInHelp: '',
    builder: (yargs)=>{},
    handler: defaultFunction,
    middlewares: [],
    deprecated: false,

}] as CliCommand[];