
import { getAppInstance, getAppProvider, getProvider } from "..";
import { CliFunctionContext } from "../../module_cli/types/cliCommand";

export default async function({cli}:CliFunctionContext){
   cli('initapp', async (args)=>{
    if (!args.provider) return console.log('missing required --provider');
    if (!args.id) return console.log('missing required --id');

    let provider = await getProvider(args.provider);
    if (!provider) return console.log('provider '+args.provider+' doesnt exist');

    var newAppEntry = new storage.app({app_id: args.id, app_provider: args.provider});
    await newAppEntry.save();

    var appInstance = await getAppInstance(args.id);
    if (!appInstance) return console.log('something went wrong');
    await appInstance.init();
   }, 
   'install new application',
   (yargs)=>{
    yargs.positional('provider', {describe: "application provider (required)", type: 'string'});
    yargs.positional('id', {describe: "application id (required)", type: 'string'});
   })

} 