import yargs = require("yargs");
import test_mongo from "./test_mongo";
import { CliCommand } from "../../module_cli/types/cliCommand";

export default [{
    command: 'mongo-test',
    showInHelp: '',
    builder: (yargs)=>{},
    handler: test_mongo,
    middlewares: [],
    deprecated: false,

}] as CliCommand[];