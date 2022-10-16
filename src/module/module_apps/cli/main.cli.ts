import yargs from "yargs";
import c from '../../../common/cli_colors';
import { getAppInstance, getAppProvider } from "..";
import { CliFunctionContext } from "../../module_cli/types/cliCommand";
import { ApplicationCliModule, ApplicationModule } from "../types/ApplicationModule";
import { implementCliCommands } from "../../module_cli";
export default async function({cli}:CliFunctionContext){
    cli('app', async (args)=>{
        let argv = (args._) as string[];
        let appId = argv[1];
        var appInstance = await getAppInstance(appId);
        var appProvider = await getAppProvider(appId);
        if (!appInstance||!appProvider) return console.log(`${c.red}${c.dim}error: ${c.reset} application "${appId}" doesn't exist`);
    
        for(var module of Object.values(context.modules)){
            if (!module.features.includes('app_cli')) continue;
            verbose(`app_cli: ${module.id} has app_cli feature`);
            var cliModule = module as any as ApplicationCliModule;
            let y = yargs(argv.slice(2));
            args.current_app = appInstance;
            await implementCliCommands(yargs, cliModule.application_cli, args, module.id);
        }
    });

} 
