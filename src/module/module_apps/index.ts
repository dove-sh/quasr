import { Application } from "./types/Application";
import { ApplicationModule } from "./types/ApplicationModule";
import { IAppEntry } from "./types/IAppEntry";

export async function getProvider(id: string):Promise<ApplicationModule>{

    return (global.context.modules[id] as any) as ApplicationModule;
}

export async function getAppInstance(id:string):Promise<Application|false>{
    var app = await storage.app.findOne({app_id: id}).exec();
    if (!app) return false && verbose(`app: ${id} doesn't exist`);
    var currentApp = (app as IAppEntry);
    var currentProvider = await getProvider(currentApp.app_provider);
    return new currentProvider.application(currentApp);
}
export async function getAppProvider(id: string):Promise<ApplicationModule|false>{
    var app = await storage.app.findOne({app_id: id}).exec();
    if (!app) return false && verbose(`app: ${id} doesn't exist`);
    var currentApp = (app as IAppEntry);
    var currentProvider = await getProvider(currentApp.app_provider);
    return currentProvider;
}
export async function getAppEntry(id: string):Promise<{config_path:string,id:string,path:string,provider:ApplicationModule}|false>{
    var app = await storage.app.findOne({app_id: id}).exec();
    if (!app) return false && verbose(`app: ${id} doesn't exist`);
    var currentApp = (app as IAppEntry);
    var currentProvider = await getProvider(currentApp.app_provider);

    return {config_path: currentApp.app_config_path, id:currentApp.app_id, path: currentApp.app_path, provider: await getProvider(currentApp.app_provider)};
}