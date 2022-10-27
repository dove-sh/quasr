import { Console } from "node:console";
import cli_colors from "../../../../common/cli_colors";
import { CliFunctionContext } from "../../../module_cli/types/cliCommand";
import { Application } from "../../types/Application";

export default async function({cli}:CliFunctionContext){
    cli('status', async (args)=>{
        
        let status = await (args.ctx.current_app as Application).status();
        console.log(
`${status.status=='running'?cli_colors.green
:status.status=='stopped'?cli_colors.red:''}[${status.status}] ${cli_colors.reset}${cli_colors.bright}${status.heading}${cli_colors.reset}
`); 
if (status.bind) console.log(
    `listening on ${status.bind.proto}: ${cli_colors.dim}${status.bind.publicIp}${cli_colors.reset}:${status.bind.port} ${status.bind.privateIp ? `${cli_colors.dim}(${status.bind.privateIp})${cli_colors.reset}` : ''}`
);

        for(var key of Object.keys(status)){
            var val = status[key];
            if (key=='heading'||key=='status')continue;
            if (key=='bind'&&val.publicIp) continue;
            if (val.publicIp){
                console.log(
                    `${key} ${val.proto}: ${cli_colors.underscore}${val.publicIp}${cli_colors.reset}:${val.port} ${cli_colors.dim}${val.privateIp}${cli_colors.reset}`
                );
            }
            else if (typeof val.count !== 'undefined'){
                console.log(`${key}: ${val.count}${val.max?`${cli_colors.dim}/${cli_colors.reset}${val.max}`:''}`)
            }
            else if (key=='map'){
                console.log(`${key}: ${val.name}`)
            }
            else {
                console.log(`${key}: ${val}`);
            }
        }
        console.log(`${cli_colors.dim}app: ${args.ctx.current_app.app_id} provider: ${args.ctx.current_provider.id}${cli_colors.reset}`);

    });

} 