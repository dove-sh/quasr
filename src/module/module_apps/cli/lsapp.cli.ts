
import { getAppInstance, getAppProvider, getProvider } from "..";
import { CliFunctionContext } from "../../module_cli/types/cliCommand";
import { Application, getNewAppConfigPath } from "../types/Application";
import cli_spinners from 'cli-spinners';
import loading from 'loading-cli';
import cli_colors from "../../../common/cli_colors";
import { IAppEntry } from "../types/IAppEntry";
export default async function({cli}:CliFunctionContext){
   cli('lsapp', async (args)=>{
    let apps = (await storage.app.find({}).exec()) as IAppEntry[];
    if (apps.length != 0) console.log(`List of apps installed: `);
    else console.log(`no apps installed\nuse quasr initapp --provider (application provider) --id (new app id) to create one`);
    for(let app of apps){
        console.log(`${cli_colors.dim}[${app.app_provider}]${cli_colors.reset} ${cli_colors.bright}${app.app_id}${cli_colors.reset}`)
    }
   }, 
   'list all applications')

} 