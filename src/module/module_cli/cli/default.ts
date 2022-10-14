import c from '../../../common/cli_colors'

export default async function(){
    console.log(global.context.brand.render_cli_logo(`${c.dim}dove/${c.reset}quasr\nv${global.context.version}`));
}