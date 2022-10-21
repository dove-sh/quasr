import express, { Express, Request, Response } from 'express';
import { platform } from 'process';
import { createTextChangeRange } from 'typescript';
import cli_colors from '../../../common/cli_colors';
import { ApiModule } from '../types/apiModule';
export default async function run(argv:any){
    console.log(`${context.brand.cli_icon} ${context.brand.cli_accent}api${cli_colors.reset} started`)
    const app = express();
    let listenHttp = argv.listenHttp
     || process.env.QUASR_LISTEN_HTTP
     || (config.api&&config.api.httpListen);


    for(var module of Object.values(context.modules)){
        if (module.features&&module.features.includes('api')){
            verbose(`api: mod ${module.id} has api feature`);
            var apiModule = (module as any) as ApiModule;
            if (apiModule&&apiModule.api_middlewares&&apiModule.api_middlewares.length!=0){
                for(var middlware of apiModule.api_middlewares){
                    verbose(`api: mod ${module.id} implements middleware "${middlware.endpoint}"`)
                    app.use(middlware.endpoint,middlware.handler);
                }
            }
            if (apiModule&&apiModule.endpoints&&apiModule.endpoints.length==0){
                for(var endpoint of apiModule.endpoints){
                    if (endpoint.method=='get')
                        app.get(endpoint.endpoint, endpoint.handler);
                    if (endpoint.method=='post')
                        app.post(endpoint.endpoint, endpoint.handler);
    
                    verbose(`api: mod ${module.id} implements endpoint ${endpoint.method} "${endpoint.endpoint}"`)
                }
            }


            
        }
    }
    
    
    if (listenHttp) 
        app.listen(listenHttp.split(':')[1], listenHttp.split(':')[0],
        ()=>console.log(`${cli_colors.dim}[http] listening on: ${cli_colors.reset}${listenHttp} `));
    else verbose(`api: not listening on http ${listenHttp}`)
    let listenUnix = platform=='linux' ? 
        argv.listenUnix || process.env.QUASR_LISTEN_UNIX || (config.api&&config.unixListen) : false;
    if (listenUnix)
        app.listen(listenUnix, 
            ()=>console.log(`${cli_colors.dim}[unix] listening on: ${cli_colors.reset}${listenUnix} `))
    else verbose(`api: not listening on unix ${listenUnix}`);
    argv.daemon();
    global.isCli = false;
    
}