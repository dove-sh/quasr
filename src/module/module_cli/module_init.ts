import * as yargs from 'yargs';

export async function module__init(){
    yargs.scriptName('quasr').usage('$0 <cmd> [args]');
}