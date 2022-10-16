import path from "path";
import { ApiModule } from "../module_api/types/apiModule";
import { includeCliDir } from "../module_cli";
import { CliModule } from "../module_cli/types/cliCommand";
import { init } from "./module_core";
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
    cliCommands: includeCliDir(path.resolve(__dirname, './cli'),{})
} as module_quasr_core