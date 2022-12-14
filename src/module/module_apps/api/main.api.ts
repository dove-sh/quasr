import { appendFileSync } from "fs";
import { getAppEntry, getAppProvider } from "..";
import ApiContext from "../../module_api/types/ApiContext";
import { ApplicationModule } from "../types/ApplicationModule";
import { IAppEntry } from "../types/IAppEntry";
import type {Module} from '../../../types/module';
export default function({app}:ApiContext){
    app.get('/list_apps', async (req,res)=>{
        let apps = (await storage.app.find({}).exec()) as IAppEntry[];
        return res.json({result:
        await Promise.all(
            apps.map(async entry=>{
                let providerModule = (await getAppProvider(entry.app_id) as any as Module);
                return {id: entry.app_id, config: entry.app_config_path, provider: {id: providerModule.id, name: providerModule.name, describe: providerModule.describe, features: providerModule.features}};
            }
        ))});
    });
    app.get('/appinfo/:appId', async (req,res)=>{
        var entry:false | {
            config_path: string;
            id: string;
            path: string;
            provider: ApplicationModule;
        } = await getAppEntry(req.params.appId);
        
        if (!entry) return res.json({error:'app not found', app_not_found: true});
        let providerModule = (entry.provider as any as Module);
        return res.json({result: {id: entry.id, config: entry.config_path, provider: {id: providerModule.id, name: providerModule.name, describe: providerModule.describe, features: providerModule.features}}});
    })
}