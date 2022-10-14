import { CliModule } from "../module_cli/types/cliCommand";
import cli from './cli/_cli';
import { ApiModule } from "./types/apiModule";
import {implementDirSync} from './index';
import path from "path";
interface quasr_module_api extends ApiModule, CliModule, Module{}

export default {

    id:'api',
    name:'Quasr (api)',
    describe: 'HTTP Api server',
    by:'fearfeth',

    features: ['api','cli'],
    depends: [],
    cliCommands: cli, 
    endpoints: implementDirSync(path.resolve(__dirname,'./api'))

} as quasr_module_api;