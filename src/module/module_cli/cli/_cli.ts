import yargs = require("yargs");
import defaultFunction from './default';
import expensesFunction from './expenses'
import { CliCommand } from "../types/cliCommand";

export default [{
    command: '$0',
    showInHelp: '',
    builder: (yargs)=>{},
    handler: defaultFunction,
    middlewares: [],
    deprecated: false,

},
{
    command: 'expenses',
    showInHelp: '',
    builder: (yargs)=>{},
    handler: expensesFunction,
    middlewares: [],
    deprecated: false,

}] as CliCommand[];