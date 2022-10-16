import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import _cli from "./cli/_cli";
import {module_load, module_start} from "./module_apps";
import {app_middleware} from './api/appMiddleware';

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
    cliCommands: _cli,
    api_middlewares: [{endpoint: '/app/:appId', handler: app_middleware}]
} as quasr_module_app;