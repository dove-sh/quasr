import path from "path"
import { implementDirSync } from "../module_api"
import { ApiModule } from "../module_api/types/apiModule"
import { module__start } from "./module_runtty"

interface module_runtty extends Module, ApiModule{}

export default async ()=>{
    return {
        id: 'runtty',
        name: "Default process runner",
        describe: "just runs your apps, nothing else",
        icon: "🚀", 
        by: 'feli',
        start: module__start,
        startAfter: [],
        features: ['run_provider', 'api'],
        endpoints: await implementDirSync(path.resolve(__dirname, 'module/module_runtty/api'))
    } as module_runtty
}