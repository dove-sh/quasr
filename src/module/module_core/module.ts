import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import { init } from "./module_core";
import _cli from './cli/_cli';
interface module_quasr_core extends Module,CliModule,ApiModule{}
export default {
    id: 'core',
    name: 'Quasr (core)',
    describe: 'base functionality', 
    by: 'fearfeth', 
    features: ['cli', 'api'],
    depends: [], 
    loadAfter: ['mongo'],
    load: init,
    cliCommands: _cli
} as module_quasr_core