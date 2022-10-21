import { CliModule } from "../module_cli/types/cliCommand";
import cli from './cli/_cli';
import { ApiModule } from "./types/apiModule";
import {implementDirSync} from './index';
import path from "path";
interface quasr_module_api extends ApiModule, CliModule, Module{}

export default async ()=>{
return {

    id:'api',
    name:'Quasr (api)',
    describe: 'HTTP Api server',
    by:'feli',
    icon: '🌍',
    features: ['api','cli'],
    depends: [],
    cliCommands: cli, 
    endpoints: await implementDirSync(path.resolve(__dirname,'module/module_api/api'))

} as quasr_module_api;}