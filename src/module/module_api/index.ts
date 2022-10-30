import { Request, Response} from "express";
import { appendFile, existsSync, fstat, PathLike, readdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import { isAnyArrayBuffer } from "util/types";
import { ApiEndpoint } from "./types/apiModule";
import deasync from 'deasync';
import module_import_condition from "./module_import_condition";
import * as ws from "ws";

export async function implementDirSync<T=ApiEndpoint>(dir:PathLike,context:any={}):Promise<T[]>{
    if(!module_import_condition()){
        verbose(`api: refusing to parse routes because import condition is false`)
        return[];
    }
    if (!existsSync(dir)) throw 'api: implementDir - no such directory '+dir;
    let endpoints:T[]=[];
    verbose(`api: parsing routes from ${dir.toString()}`);
    var read = readdirSync(dir, {withFileTypes:true});
    
    for(var dirent of read){
        if (dirent.isFile()&&(dirent.name.endsWith('.route.js')||dirent.name.endsWith('.route.ts')
        ||dirent.name.endsWith('.api.js')||dirent.name.endsWith('.api.ts'))){
            verbose(`api: require ${path.resolve(dir as string,dirent.name)}`);
            let routeModule = (await import('file:'+path.resolve(dir as string,dirent.name))).default;
            let currentContext = context;
            currentContext.app = {
                get: (endpoint: string, handler: Function)=>
                    {
                        verbose(`api: ${dirent.name} imports get "${endpoint}"`);
                        endpoints.push({method: 'get', handler, endpoint} as T)
                    },
                post: (endpoint: string, handler: Function)=>
                    {
                        verbose(`api: ${dirent.name} imports post "${endpoint}"`);
                        endpoints.push({method: 'post', handler, endpoint} as T)
                    },
                put: (endpoint: string, handler: Function)=>
                    {
                        verbose(`api: ${dirent.name} imports put "${endpoint}"`);
                        endpoints.push({method: 'put', handler, endpoint} as T)
                    },
                ws: (endpoint: string, handler: Function)=>
                    {
                        verbose(`api: ${dirent.name} imports websocket "${endpoint}"`);
                        endpoints.push({method: 'ws', handler, endpoint} as T)
                    },
                
            };
            routeModule(currentContext);
            
        }
    }
    verbose(`api: [${endpoints.map(e=>'"'+(e as any).endpoint+'"').join(', ')}]`);
    return endpoints;
}