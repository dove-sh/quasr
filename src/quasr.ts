#!/bin/sh 
":" //# comment; exec /usr/bin/env node --experimental-specifier-resolution=node --no-warnings "$0" "$@"
import * as mongo from './base/mongo';
import * as url from 'url';
import './common/promises';
import { Module } from './types/module';
import { distroInfo, getDistroInfo } from './common/distribution';
import { executeModules } from './base/executeModules';
import { getConfig } from './base/config';
import { warnwin32 } from './base/warnwin32';
import { verbose } from './base/verbose';
import { print } from './base/print';
declare global{
    var context:Context;
    var verbose:Function;
    var print:Function;
    var config:any;
    var __dirname:string;
    var __filename:string;
    var isCli:boolean;
    var distro:distroInfo;
}

global.__filename = url.fileURLToPath(import.meta.url);
global.__dirname = url.fileURLToPath(new URL('.', import.meta.url));
global.isCli = true;

//top-level async
(async ():Promise<void>=>{
    global.distro = await getDistroInfo(); await warnwin32();
    global.verbose = verbose;
    global.print = print;
    verbose(`quasr: hello world!`);
    global.config=await getConfig();
    verbose('quasr: look at this config'); verbose(config);
    global.context = await (await import('./base/context')).default();

    await mongo.init();
    
    let modules:Module[] = Object.values(global.context.modules); let daemonMode:boolean = false;
    let context = (module:Module)=>{ return { daemon: ()=>(daemonMode=true) && verbose(`quasr: ${module.id} enforced daemon mode; modules won't unload until any kill-signal recieved`) } }
    
    await executeModules(modules, 'load', 'loadAfter', context);
    await executeModules(modules, 'start', 'startAfter', context);

    async function stop(){
        await executeModules(modules, 'stop', 'stopAfter', ()=>{});
        await mongo.stop(); process.exit(0);
    }
    if (!daemonMode) await stop(); process.on('SIGTERM', stop);
})()
.catch(e=>console.error(e));

