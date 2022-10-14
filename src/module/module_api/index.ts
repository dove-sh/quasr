import { RequestHandler} from "express";
import { existsSync, fstat, PathLike, readdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import { isAnyArrayBuffer } from "util/types";
import { ApiEndpoint } from "./types/apiModule";
import deasync from 'deasync';


export function implementDirSync(dir:PathLike):ApiEndpoint[]{
    if (!existsSync(dir)) throw 'no such directory';
    let endpoints:ApiEndpoint[]=[];
    var read = readdirSync(dir, {withFileTypes:true});
    for(var dirent of read){
        if (dirent.isFile()&&(dirent.name.endsWith('.route.js')||dirent.name.endsWith('.route.ts'))){
            
            let routeModule = (require(path.resolve(dir as string,dirent.name))).default;
            
            routeModule({app: {
                get: (endpoint: string, handler: RequestHandler)=>
                    {endpoints.push({method: 'get', handler, endpoint})},
                post: (endpoint: string, handler: RequestHandler)=>
                    {endpoints.push({method: 'post', handler, endpoint})},
                ws: (endpoint: string, handler: RequestHandler)=>
                    {endpoints.push({method: 'ws', handler, endpoint})},
                
            }});
        }
    }
    return endpoints;
}