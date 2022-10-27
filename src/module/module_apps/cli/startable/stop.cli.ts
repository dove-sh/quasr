import { CliFunctionContext } from "../../../module_cli/types/cliCommand";
import { Application } from "../../types/Application";
import { StartableApplication } from "../../types/StartableApplication";
import cli_spinners from 'cli-spinners';
import loading from 'loading-cli';
import cli_colors from "../../../../common/cli_colors";
export default async function({cli}:CliFunctionContext){
    cli('stop', async (args)=>{
        let loader = 
        loading({text: "stopping application...", interval: cli_spinners.arc.interval, stream: process.stdout, frames: cli_spinners.arc.frames});
        loader.start();
        try{
            await (args.ctx.current_app as StartableApplication).stop()
        }
        catch(e){
            loader.stop();
            return print(`${cli_colors.bgRed}${cli_colors.white} error ${cli_colors.reset} ${e.toString()}`);
        }
        loader.stop();
        print(`${cli_colors.bgGreen}${cli_colors.black} success ${cli_colors.reset} stopped application`);
    });

} 