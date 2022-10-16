import c from '../../../common/cli_colors';
import {CliFunctionContext} from '../types/cliCommand';

export default async function({cli}:CliFunctionContext){
    cli('$0', function(){
        console.log(global.context.brand.render_cli_logo(`${c.dim}dove/${c.reset}quasr\nv${global.context.version}`));
    });
}