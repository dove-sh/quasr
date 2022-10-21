import _yargs from 'yargs';
declare global{var yargs:_yargs.Argv;}
export async function module__init(){
    global.yargs = _yargs(process.argv);
    yargs.scriptName('quasr').usage('$0 <cmd> [args]');
}