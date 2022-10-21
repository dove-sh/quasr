import { CliFunctionContext } from "../../module_cli/types/cliCommand";
import c from '../../../common/cli_colors'

export default async function({cli}:CliFunctionContext){
    cli('lsmodule', ()=>{
        let modules = Object.values(context.modules);
        if (modules.length==0) return console.log(`no modules installed`);

        for(var module of modules){
            console.log(
`${module.icon}  ${c.dim}[${module.id}]${c.reset} ${c.bright}${module.name}${c.reset}
    by: ${module.by}  features: ${c.dim}[${c.reset}${module.features.join(', ')}${c.dim}]${c.reset}
    ${module.describe}`
)
        }
    })
}