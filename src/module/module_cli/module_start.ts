
import yargs = require("yargs");
import { CliModule } from "./types/cliCommand";

export async function module__start(ctx:any){
    for(var module of Object.values(global.context.modules)){
        if (module.features.includes('cli')){
            verbose(`cli: mod ${module.id} has cli feature`);
            var cliModule = (module as any) as CliModule;
            for (var moduleCommand of cliModule.cliCommands){
                verbose(`cli: mod ${module.id} implements "${moduleCommand.command}"`);
                let middlewares:yargs.MiddlewareFunction[] = [];
                let currentModCommand = moduleCommand;
                yargs.command(currentModCommand.command, currentModCommand.showInHelp, 
                    currentModCommand.builder??(()=>{}), async (args: yargs.ArgumentsCamelCase<{}>) =>{
                        verbose(`cli: running ${currentModCommand.command}`);
                        args.ctx=ctx;
                        args.daemon = ()=>{verbose(`cli: ${module.id} -> "${currentModCommand.command}" enforced daemon mode`); ctx.daemon()}
                        
                        var executeResult = currentModCommand.handler(args);
                        if (executeResult instanceof Promise)await executeResult;
                    }
                    , currentModCommand.middlewares, currentModCommand.deprecated);
            }
            
        }
    }
    
    await yargs.parse();
}