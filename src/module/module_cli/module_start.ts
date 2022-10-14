import yargs = require("yargs");
import { CliModule } from "./types/cliCommand";

export async function module__start(){
    for(var module of Object.values(global.context.modules)){
        if (module.features.includes('cli')){
            verbose(`cli: mod ${module.id} has cli feature`);
            var cliModule = (module as any) as CliModule;
            for (var moduleCommand of cliModule.cliCommands){
                verbose(`cli: mod ${module.id} implements "${moduleCommand.command}"`)
                yargs.command(moduleCommand.command, moduleCommand.showInHelp, 
                    moduleCommand.builder, moduleCommand.handler, 
                    moduleCommand.middlewares, moduleCommand.deprecated);
            }
            
        }
    }
    yargs.help().argv;
}