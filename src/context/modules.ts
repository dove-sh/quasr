import path = require("path");
import fs = require('fs/promises');
export async function getModules():Promise<{[key: string]: Module}>{
    let modulesDir = path.resolve(__dirname, '../module');
    let modulesDirs = await fs.readdir(modulesDir, {withFileTypes: true});

    let availableModules:{[key: string]: Module}={};
    for(var possibleModule of modulesDirs){
        if (!possibleModule.isDirectory())continue;
        if (!possibleModule.name.startsWith('module_'))continue;


        global.verbose(`quasr: ${possibleModule.name}.default import`);

        let loadedModule = (require(
            path.resolve(__dirname, '../module/'+possibleModule.name+'/module.js')
        )).default as Module;
        verbose(`${loadedModule.id}: ${loadedModule.name} (${loadedModule.features.join(', ')})`);
        availableModules[loadedModule.id]=loadedModule;
    }

    return availableModules;
}