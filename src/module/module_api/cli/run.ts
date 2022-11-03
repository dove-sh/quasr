import express, { Express, Request, Response } from 'express';
import { platform } from 'process';
import { createTextChangeRange } from 'typescript';
import cli_colors from '../../../common/cli_colors';
import { ApiModule, HttpRequestHandler } from '../types/apiModule';
import expressWs, { WebsocketRequestHandler } from 'express-ws';
import bodyParser from 'body-parser';
import { chmod, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import cors from 'cors';
export default async function run(argv:any){
    console.log(`${context.brand.cli_icon} ${context.brand.cli_accent}api${cli_colors.reset} started`)
    const app = express();
    app.use(cors())
    app.use(bodyParser.json())
    var expressWebsocket = expressWs(app);
    
    let listenHttp = argv.listenHttp
     || process.env.QUASR_LISTEN_HTTP
     || (config.api&&config.api.httpListen);


    for(let module of Object.values(context.modules).sort((a,b)=>(a.api_middleware_order??0)-(b.api_middleware_order??0))){
        if (!module.features||!module.features.includes('api')) continue;
            verbose(`api: mod ${module.id} has api feature`);
            let apiModule = (module as any) as ApiModule;
            if (apiModule&&apiModule.api_middlewares&&apiModule.api_middlewares.length!=0){
                for(let middlware of apiModule.api_middlewares.sort((a,b)=>(a.api_middleware_order??0)-(b.api_middleware_order??0))){
                    verbose(`api: mod ${module.id} implements middleware "${middlware.endpoint}" (${apiModule.api_middleware_order??0}, ${middlware.api_middleware_order??0})`)
                    if (middlware.endpoint) app.use(middlware.endpoint,middlware.handler);
                    else {app.use(middlware.handler);}
                }
            }
        }
        for(var module of Object.values(context.modules)){        
            if (!module.features||!module.features.includes('api')) continue;
            let apiModule = (module as any) as ApiModule;
            if (apiModule&&apiModule.endpoints&&apiModule.endpoints.length!=0){
                
                for(let endpoint of apiModule.endpoints){
                    if (endpoint.method=='get')
                        app.get(endpoint.endpoint, endpoint.handler as HttpRequestHandler);
                    if (endpoint.method=='post')
                        app.post(endpoint.endpoint, endpoint.handler as HttpRequestHandler);
                    if (endpoint.method=='put')
                        app.put(endpoint.endpoint, endpoint.handler as HttpRequestHandler);
                    if (endpoint.method=='ws')
                        expressWebsocket.app.ws(endpoint.endpoint, endpoint.handler as WebsocketRequestHandler);
    
                    verbose(`api: mod ${module.id} implements endpoint ${endpoint.method} "${endpoint.endpoint}"`)
                }
            }


            
        }
    
    
    let listenUnix = platform=='linux' ? 
        argv.listenUnix || process.env.QUASR_LISTEN_UNIX || (config.api&&config.api.unixListen) : false;
    if (listenUnix&&existsSync(listenUnix)) await unlink(listenUnix);
    if (listenHttp) 
        app.listen(listenHttp.split(':')[1], listenHttp.split(':')[0],
        ()=>console.log(`${cli_colors.dim}[http] listening on: ${cli_colors.reset}${listenHttp} `));
    else verbose(`api: not listening on http ${listenHttp}`)

    if (listenUnix){
        
        app.listen(listenUnix, 
            ()=>{
                console.log(`${cli_colors.dim}[unix] listening on: ${cli_colors.reset}${listenUnix} `)
                chmod(listenUnix,511)
                
            })
    }
    else verbose(`api: not listening on unix ${listenUnix}`);
    argv.daemon();
    global.isCli = false;
    
}