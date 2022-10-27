
import { getAppInstance, getAppProvider, getProvider } from "..";
import { CliFunctionContext } from "../../module_cli/types/cliCommand";
import { Application, getNewAppConfigPath } from "../types/Application";
import cli_spinners from 'cli-spinners';
import loading from 'loading-cli';
import cli_colors from "../../../common/cli_colors";
export default async function({cli}:CliFunctionContext){
   cli('initapp', async (args)=>{
    if (!args.provider) return console.log('missing required --provider');
    if (!args.id) return console.log('missing required --id');

    let provider = await getProvider(args.provider);
    if (!provider) return print(`${cli_colors.bgRed}${cli_colors.white} error ${cli_colors.reset} provider ${args.provider} doesnt exist`);
    var newAppEntry = new storage.app({app_id: args.id, app_provider: args.provider, app_config_path: getNewAppConfigPath(args.id)});
    await newAppEntry.save();

    var appInstance = await getAppInstance(args.id);
    if (!appInstance) print(`${cli_colors.bgRed}${cli_colors.white} error ${cli_colors.reset} tried to save new instance, but it didn't. somthing wrong with database?`);
    
    let loader = loading({text: "installing application...", interval: cli_spinners.arc.interval, stream: process.stdout, frames: cli_spinners.arc.frames});
    loader.start();
    try{ await (appInstance as Application).init(); }
    catch(e){
        loader.stop();
        return print(`${cli_colors.bgRed}${cli_colors.white} error ${cli_colors.reset} ${e.toString()}`);
    }
    loader.stop();
    print(
`${cli_colors.bgGreen}${cli_colors.black} success ${cli_colors.reset} application #${newAppEntry.app_id} sucessfully created!
type "${cli_colors.dim}quasr${cli_colors.reset} app ${cli_colors.underscore}${newAppEntry.app_id}${cli_colors.reset} --help" to check what to do with it`);
    
   }, 
   'install new application',
   (yargs)=>{
    yargs.positional('provider', {describe: "application provider (required)", type: 'string'});
    yargs.positional('id', {describe: "application id (required)", type: 'string'});
   })

} 