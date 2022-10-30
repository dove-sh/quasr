import path from "path";
import { ApiModule } from "../module_api/types/apiModule";
import { includeCliDir } from "../module_cli";
import { CliModule } from "../module_cli/types/cliCommand";

import getBrand from '../../base/brand';
import { implementDirSync } from "../module_api";
import { Module } from "../../types/module";
import { module_load } from "./module_dove";
import { access_middleware } from "./access/access_middleware";
interface module_dove_env extends Module, ApiModule{}
export default async ()=>{
    return {
    id: 'dove_env',
    name: 'Dove compatibility',
    describe: 'this makes everything work perfectly with dove', 
    by: 'dove.sh', 
    features: ['api'],
    depends: [], 
    icon: '🕊️',
    load: module_load,
    loadAfter: [],
    endpoints: await implementDirSync(path.resolve(__dirname, 'module/module_dove/access')),
    api_middlewares: [{handler: access_middleware, api_middleware_order: -9999}],
    api_middleware_order: -9999
} as module_dove_env}