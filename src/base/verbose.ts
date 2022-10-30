import cli_colors from "../common/cli_colors";

var lastVerboseMesasge:number=Date.now();
export function verbose(l:any){
    if (process.argv&&process.argv.includes('-v')){
        process.stdout.write(cli_colors.dim);
        if (typeof l === 'string') console.log(`${Date.now()-lastVerboseMesasge}ms  ${l.replaceAll(`!!!`,`${cli_colors.red}!!!${cli_colors.reset}`)}`);
        else console.log(l);
        process.stdout.write(cli_colors.reset);
        lastVerboseMesasge=Date.now();
    } 
}