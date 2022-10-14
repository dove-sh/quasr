import { CliModule } from "./types/cliCommand";

import { module__init } from "./module_init";
import { module__start } from "./module_start";
import cliCommands from "./cli/_cli";
interface quasr_module_cli extends Module, CliModule{}
export default 
{
    id: 'cli',
    name: 'Quasr (cli)',
    describe: './quasr', 
    by: 'fearfeth', 
    features: ['cli'],
    depends: [], 
    init: module__init, 
    start: module__start,
    startAfter: ['*'],
    cliCommands: cliCommands
} as quasr_module_cli