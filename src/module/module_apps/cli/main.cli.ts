import _yargs from "yargs";
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
    
        let y = _yargs(argv.slice(2));

        if (!(appProvider as any as Module).features.includes('app_cli')) return console.log(`${c.red}${c.dim}error: ${c.reset} application "${appId}" doesn't support app_cli`);
        verbose(`app_cli: ${(appProvider as any as Module).id} has app_cli feature`);
        var cliModule = appProvider as any as ApplicationCliModule;
        args.current_app = appInstance;
        args.current_provider = (appProvider as any as Module);
        await implementCliCommands(y, cliModule.application_cli, args, (appProvider as any as Module).id);

        verbose('app_cli: trying to run');
        await y.parse();
    });

} 
