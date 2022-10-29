import path from "path";
import { ApiModule } from "../module_api/types/apiModule";
import { includeCliDir } from "../module_cli";
import { CliModule } from "../module_cli/types/cliCommand";
import { init } from "./module_core";
import getBrand from '../../base/brand';
import { implementDirSync } from "../module_api";
interface module_quasr_core extends Module,CliModule,ApiModule{}
export default async ()=>{
    return {
    id: 'core',
    name: 'Quasr (core)',
    describe: 'base functionality', 
    by: 'feli', 
    features: ['cli', 'api'],
    depends: [], 
    icon: '🌃',
    loadAfter: [],
    load: init, 
    endpoints: await implementDirSync(path.resolve(__dirname, 'module/module_core/api')),
    cliCommands: await includeCliDir(path.resolve(__dirname, 'module/module_core/cli'),{})
} as module_quasr_core}