
import yargs = require("yargs");
import { implementCliCommands } from ".";
import { CliModule } from "./types/cliCommand";

export async function module__start(ctx:any){
    for(var module of Object.values(global.context.modules)){
        if (module.features.includes('cli')){
            verbose(`cli: mod ${module.id} has cli feature`);
            var cliModule = (module as any) as CliModule;
            await implementCliCommands(yargs, cliModule.cliCommands, ctx, module.id);
        }
    }
    
    await yargs.parse();
}