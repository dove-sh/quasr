import { Request, Response} from "express";
import { appendFile, existsSync, fstat, PathLike, readdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import { isAnyArrayBuffer } from "util/types";
import { ApiEndpoint } from "./types/apiModule";
import deasync from 'deasync';


export async function implementDirSync(dir:PathLike,context:any={}):Promise<ApiEndpoint[]>{
    if (!existsSync(dir)) throw 'api: implementDir - no such directory '+dir;
    let endpoints:ApiEndpoint[]=[];
    verbose(`api: parsing routes from ${dir.toString()}`);
    var read = readdirSync(dir, {withFileTypes:true});
    
    for(var dirent of read){
        if (dirent.isFile()&&(dirent.name.endsWith('.route.js')||dirent.name.endsWith('.route.ts'))){
            verbose(`api: require ${path.resolve(dir as string,dirent.name)}`);
            let routeModule = (await import('file:'+path.resolve(dir as string,dirent.name))).default;
            verbose(`api: invoke ${dirent.name}`);
            context.app = {
                get: (endpoint: string, handler: (req: Request, res: Response)=>any)=>
                    {endpoints.push({method: 'get', handler, endpoint})},
                post: (endpoint: string, handler: (req: Request, res: Response)=>any)=>
                    {endpoints.push({method: 'post', handler, endpoint})},
                ws: (endpoint: string, handler: (req: Request, res: Response)=>any)=>
                    {endpoints.push({method: 'ws', handler, endpoint})},
                
            };
            routeModule(context);
            verbose(`api: now there's ${endpoints.length} routes`);
        }
    }
    return endpoints;
}