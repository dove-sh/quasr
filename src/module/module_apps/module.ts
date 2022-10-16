import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import {module_load, module_start} from "./module_apps";
import {app_middleware} from './api/appMiddleware';
import { includeCliDir } from "../module_cli";
import path from "path";

interface quasr_module_app extends Module, ApiModule, CliModule{}
export default {
    id: 'apps',
    name: 'Quasr (apps)',
    describe: 'default app manager', 
    by: 'fearfeth', 
    features: ['cli', 'api'],
    depends: [], 
    loadAfter: ['mongo'],
    startAfter: ['*'],
    start: module_start,
    load: module_load,
    cliCommands: includeCliDir(path.resolve(__dirname, './cli'),{}),
    api_middlewares: [{endpoint: '/app/:appId', handler: app_middleware}]
} as quasr_module_app;