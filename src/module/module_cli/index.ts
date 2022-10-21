
import { existsSync, PathLike, readdirSync } from "fs";
import path from "path";
import {MiddlewareFunction, ArgumentsCamelCase} from "yargs";
import { CliCommand, CliFunction, CliFunctionContext } from "./types/cliCommand";
export async function implementCliCommands(yargs: any, cli:CliCommand[], ctx: any, moduleId?:string){
    for (var moduleCommand of cli){
        verbose(`cli: ${moduleId?`mod ${moduleId}`:''} implements "${moduleCommand.command}"`);
        let middlewares:MiddlewareFunction[] = [];
        let currentModCommand = moduleCommand;
        yargs.command(currentModCommand.command, currentModCommand.showInHelp, 
            currentModCommand.builder??(()=>{}), async (args: ArgumentsCamelCase<{}>) =>{
                verbose(`cli: running ${currentModCommand.command}`);
                args.ctx=ctx;
                args.daemon = ()=>{verbose(`cli: ${moduleId?`mod ${moduleId} ->`:''} "${currentModCommand.command}" enforced daemon mode`); ctx.daemon()}
                
                var executeResult = currentModCommand.handler(args);
                if (executeResult instanceof Promise)await executeResult;
            }
            , currentModCommand.middlewares, currentModCommand.deprecated);
    }
}
export async function includeCliDir(dir: PathLike, context:any={}):Promise<CliCommand[]>{
    if (!existsSync(dir)) throw 'cli: implementDir - no such directory '+dir;
    let commands:CliCommand[]=[];
    verbose(`cli: parsing commands from ${dir.toString()}`);
    var read = readdirSync(dir, {withFileTypes:true});
    
    for(var dirent of read){
        if (dirent.isFile()&&(dirent.name.endsWith('.cli.js')||dirent.name.endsWith('.cli.ts'))){
            verbose(`cli: require ${path.resolve(dir as string,dirent.name)}`);
            let routeModule = (await import('file:'+path.resolve(dir as string,dirent.name))).default;
            verbose(`cli: invoke ${dirent.name}`);
            context.cli = function(command: string, handler: (args:any)=>any, showInHelp:string='', builder:any=(()=>{})){
                commands.push({command, handler, showInHelp, builder});
            } as CliFunction;
            routeModule(context as CliFunctionContext);
            verbose(`cli: now there's ${commands.length} commands`);
        }
    }
    return commands;
}