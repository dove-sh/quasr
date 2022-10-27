import path from "path";
import fs from 'fs/promises';
import { existsSync } from "fs";
export async function getModules():Promise<{[key: string]: Module}>{
    let modulesDir = path.resolve(__dirname, 'module');
    let modulesDirs = await fs.readdir(modulesDir, {withFileTypes: true});

    let availableModules:{[key: string]: Module}={};
    for(var possibleModule of modulesDirs){
        if (!possibleModule.isDirectory())continue;
        if (!possibleModule.name.startsWith('module_'))continue;
        if (existsSync(path.resolve(__dirname, 'module/'+possibleModule.name+'/module_import_condition.js'))){
            global.verbose(`quasr: ${possibleModule.name} has import condition`);
            let loadedCondition = (await import('file:'+path.resolve(__dirname, 'module/'+possibleModule.name+'/module_import_condition.js'))).default;
            if (loadedCondition instanceof Function){loadedCondition = loadedCondition();}
            if (loadedCondition instanceof Promise){loadedCondition = await loadedCondition;}
            if (!loadedCondition
                && !process.argv.includes('lsmodule')){
                verbose(`quasr: ${possibleModule.name} condition result is false (${loadedCondition}), skipping`);
                continue;
            }
            
        }

        global.verbose(`quasr: ${possibleModule.name}.default import`);
        
        let importPath = 'file:'+
        path.resolve(__dirname, 'module/'+possibleModule.name+'/module.js');
        let loadedModule = (await import(importPath)).default as Module;
        if (loadedModule instanceof Function){loadedModule = loadedModule()}
        if (loadedModule instanceof Promise){loadedModule = await loadedModule}
        verbose(`${loadedModule.id}: ${loadedModule.name} (${loadedModule.features.join(', ')})`);
        availableModules[loadedModule.id]=loadedModule;
    }

    return availableModules;
}