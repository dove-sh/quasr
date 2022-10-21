import _yargs from 'yargs';
declare global{var yargs:_yargs.Argv;}
export async function module__init(){
    let argv = process.argv.filter(
        a=>
        a!='--experimental-specifier-resolution=node'&&
        !a.includes('node.exe') && !a.includes('/usr/bin/node')
        &&!a.includes('quasr.js')
        ); // пиздец
    global.yargs = _yargs(argv);
    yargs.scriptName('quasr').usage('$0 <cmd> [args]');
}