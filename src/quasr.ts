
import './import';
import * as yargs from 'yargs';
import {getFiles} from './common/fs_extensions';
import path = require('path');
import { fileURLToPath } from 'url';
import { Dirent, existsSync, fstat, PathLike} from 'fs';
import {readdir, readFile} from 'fs/promises';
import { platform } from 'os';
import { parse } from 'yaml';
import { resolve } from 'path';
import cli_colors from './common/cli_colors';
declare global{
    var context:Context;
    var verbose:Function;
    var config:any;
}

//top-level async
(async ():Promise<void>=>{
    
    global.verbose = function (l:any){
        if (process.argv&&process.argv.includes('-v')){
            process.stdout.write(cli_colors.dim);
            console.log(l);
            process.stdout.write(cli_colors.reset);
        } 
    }
    verbose(`quasr: hello world!`);

    async function parseConfigDir(dir:PathLike){
        for(var dirent of await readdir(dir, {withFileTypes: true})){
            if (dirent.isFile()){
                if (dirent.name.endsWith('.json'))
                    global.config[
                        dirent.name
                            .replaceAll('.json',"")
                            .replaceAll('.yaml',"")
                            .replaceAll('.yml',"")] 
                    = JSON.parse((await readFile(resolve(dir.toString(),dirent.name))).toString());
                    if (dirent.name.endsWith('.yaml')||dirent.name.endsWith('.yml'))
                    global.config[
                        dirent.name
                            .replaceAll('.json',"")
                            .replaceAll('.yaml',"")
                            .replaceAll('.yml',"")] 
                    = parse((await readFile(resolve(dir.toString(),dirent.name))).toString());

            }
        }
    }
    global.config={};
    platform()=='win32' 
        ?
            existsSync(resolve(__dirname,'../config')) ? await parseConfigDir('./config') : false
        :
            existsSync('/etc/quasr') ? await parseConfigDir('/etc/quasr') : false
    verbose('quasr: look at this config');
    verbose(config);

    global.context = await (await import('./context/context')).default();
    
    async function executeModules(modules:any[], executePropertyName: string, waitPropertyName: string){
        var modulesWaiting = [];
        for(var moduleId in modules) modulesWaiting.push(modules[moduleId]);
        while(modulesWaiting.length!=0){
            for(var module of modulesWaiting){
                let wait = false;
                let ignore = false;


                if (module[waitPropertyName]&&module[waitPropertyName].length!=0){
                    
                    if(module[waitPropertyName].includes('*')){
                        if (modulesWaiting.filter(m=>!m[waitPropertyName]||m[waitPropertyName].includes('*')).length != modulesWaiting.length){
                            
                            wait=true;}
                    }
                    else{
                        for (var after of module[waitPropertyName]){
                            if (!global.context.modules.hasOwnProperty(after)||!global.context.modules[after])
                            {console.log(`${module.id} is waiting for ${after}, but there's no such module`);ignore=true;}
                            if (modulesWaiting.filter(e=>e.id==after)){wait=false}
                        }
                    }
                }
                if (!wait) modulesWaiting.splice(modulesWaiting.indexOf(module),1);
                if (!ignore&&!wait
                    && module[executePropertyName]){
                        verbose(`quasr: invoke [${module.name}].${executePropertyName}`)
                         await module[executePropertyName]();
                }
            }
        }
    }
    
    let modules:Module[] = [];
    for(var moduleId in global.context.modules){
        var module = global.context.modules[moduleId];
        modules.push(module);
    }
    
    await executeModules(modules, 'init', 'initAfter');
    await executeModules(modules, 'start', 'startAfter');
})()
.catch(e=>console.error(e));

