import yargs = require("yargs");
import defaultFunction from './default';
import expensesFunction from './expenses'
import { CliCommand } from "../types/cliCommand";

export default [{
    command: '$0',
    showInHelp: '',
    handler: defaultFunction,


},
{
    command: 'expenses',
    showInHelp: '',
    handler: expensesFunction,
}] as CliCommand[];