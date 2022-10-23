import c from '../../../common/cli_colors';
import { getPort } from '../../../common/search_port';
import {CliFunctionContext} from '../types/cliCommand';

export default async function({cli}:CliFunctionContext){
    cli('$0', function(){
        console.log(global.context.brand.render_cli_logo(`${c.dim}dove/${c.reset}quasr\nv${global.context.version}`));
    });
    cli('testt', async function(argv){
        let run = await runner.create({path:'cmd.exe', args: [], size: {cols: 100, rows: 100}}, 'asdf', []);
        let attach = await run.attach();
        attach.input('echo asdf;');
        attach.onOutput((data:string)=>console.log(data));
        attach.onKilled((exitCode:number)=>{console.log("KILLED "+exitCode)});
        attach.resize({cols: 5, rows: 5});

        argv.daemon();
        process.stdin.on('data', (data:Buffer)=>{
            if(data.toString().includes('exit')) attach.detach();
        })
    })
}