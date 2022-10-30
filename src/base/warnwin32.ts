import { exec } from "child_process";
import path from "path";

export async function warnwin32(){
    if (process.platform=='win32'&&!process.argv.includes('--no-win32-warning')&&
    (process.argv[process.argv.length-1].endsWith('.js')||
    process.argv[process.argv.length-1].endsWith('quasr'))) {

        await new Promise((rr:any,rj:any)=>exec('WScript.exe '+path.resolve(__dirname,'win32_warning.js'), rr));
    }
}