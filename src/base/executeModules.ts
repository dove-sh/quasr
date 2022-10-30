export async function executeModules(modules:any[], executePropertyName: string, waitPropertyName: string, executeContext:any){
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
                        if (modulesWaiting.filter(e=>e.id==after).length!=0){wait=true}
                    }
                }
            }
            if (!wait) modulesWaiting.splice(modulesWaiting.indexOf(module),1);
            if (!ignore&&!wait
                && module[executePropertyName]){
                    verbose(`quasr: invoke [${module.name}].${executePropertyName}`)
                     await module[executePropertyName](executeContext(module));
            }
        }
    }
}