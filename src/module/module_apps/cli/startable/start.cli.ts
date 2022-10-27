import { CliFunctionContext } from "../../../module_cli/types/cliCommand";
import { Application } from "../../types/Application";
import { StartableApplication } from "../../types/StartableApplication";
import cli_spinners from 'cli-spinners';
import loading from 'loading-cli';
import cli_colors from "../../../../common/cli_colors";
import stripAnsi from 'strip-ansi';
export default async function({cli}:CliFunctionContext){
    cli('start', async (args)=>{
        let loader = 
        loading({text: "starting application...", interval: cli_spinners.arc.interval, stream: process.stdout, frames: cli_spinners.arc.frames});
        loader.start();
        try{
            await (args.ctx.current_app as StartableApplication).start()
        }
        catch(e){
            loader.stop();
            return print(`${cli_colors.bgRed}${cli_colors.white} error ${cli_colors.reset} ${e.toString()}`);
        }
        loader.stop();
        print(`${cli_colors.bgGreen}${cli_colors.black} success ${cli_colors.reset} started application`);
    });

} 