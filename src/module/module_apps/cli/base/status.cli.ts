import { CliFunctionContext } from "../../../module_cli/types/cliCommand";
import { Application } from "../../types/Application";

export default async function({cli}:CliFunctionContext){
    cli('status', async (args)=>{
        let status = await (args.current_app as Application).status();
        console.log(status);
    });

} 