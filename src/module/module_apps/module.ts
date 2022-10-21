import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import {module_load, module_start} from "./module_apps";
import {app_middleware} from './api/appMiddleware';
import { includeCliDir } from "../module_cli";
import path from "path";

interface quasr_module_app extends Module, ApiModule, CliModule{}
export default async ()=>{
    return {
    id: 'apps',
    name: 'Quasr (apps)',
    describe: 'default app manager', 
    by: 'feli', 
    features: ['cli', 'api'],
    depends: [], 
    loadAfter: [],
    icon: '🍏',
    startAfter: ['*'],
    start: module_start,
    load: module_load,
    cliCommands: await includeCliDir(path.resolve(__dirname, 'module/module_apps/cli'),{}),
    api_middlewares: [{endpoint: '/app/:appId', handler: app_middleware}]
} as quasr_module_app}