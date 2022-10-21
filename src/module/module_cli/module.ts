
import { CliModule } from "./types/cliCommand";

import { module__init } from "./module_init";

import { module__start } from "./module_start";

import { includeCliDir } from "./index";

import path from "path";
interface quasr_module_cli extends Module, CliModule{}
export default async()=>{
return {
    id: 'cli',
    name: 'Quasr (cli)',
    describe: './quasr', 
    by: 'feli', 
    features: ['cli'],
    depends: [], 
    icon: '💻',
    load: module__init, 
    start: module__start,
    startAfter: ['*'],
    cliCommands: await includeCliDir(path.resolve(__dirname, 'module/module_cli/cli'),{})
} as quasr_module_cli
}