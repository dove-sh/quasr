import c from '../../../common/cli_colors';
import { getPort } from '../../../common/search_port';
import {CliFunctionContext} from '../types/cliCommand';

export default async function({cli}:CliFunctionContext){
    cli('$0', function(){
        console.log(global.context.brand.render_cli_logo(`${c.dim}dove/${c.reset}quasr\nv${global.context.version}`));
    });
    cli('testt', async function(){
        let port = await getPort('app');
        console.log(port);
    })
}