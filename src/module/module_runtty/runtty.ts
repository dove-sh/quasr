import { spawn } from "node-pty";
import { exitCode } from "process";
import { attachedProcess, ranProcess, runner, runOptions } from "../../types/runner";
import { terminal } from "../module_apps/terminal";

declare global{
    var module_runtty_runners:{[key:string]:ranProcess};
}
export async function find(key:string){
    return global.module_runtty_runners[key];
}
export async function create(options:runOptions,key:string,tags:string[]=[],terminalBufSize:number=0):Promise<ranProcess>{
    var proc = spawn(options.path, options.args, {
        name: 'xterm-color',
        cols:options.size.cols, rows:options.size.rows,
        cwd:options.cwd??process.env.HOME,
        env:options.env??process.env
    });
    let procAlive = true;
    let onExitHandlers:any[] = [];
    let onDataHandlers:((data:string)=>any)[] = [];
    verbose(`runtty: created new tty (${options.path}${options.args&&options.args.length!=0 ? ' '+options.args.join(' ') : ''}), pid: ${proc.pid}`);
    proc.onExit((e: {exitCode:number, signal:number})=>{
        verbose(`runtty: tty exited with exitCode ${exitCode}`);
        procAlive = false;
        for(var exitHandler of onExitHandlers) exitHandler({exitCode:e.exitCode});
    });
    
    let terminalBuf:string='';
    proc.onData((e:string)=>{
        /*if (terminalBufSize!=0 &&
            (terminalBuf.length+e.length) > terminalBufSize){
                terminalBuf = terminalBuf.substring(((terminalBuf.length+e.length)-terminalBufSize));
            }*/
        terminalBuf += e;
        for(var dataHandler of onDataHandlers) dataHandler(e)
    });

    let ran = {
        tags, key,
        pid:proc.pid,
        alive:async()=>procAlive,
        kill:()=>proc.kill(),
        push(data:string){
            if (!procAlive) return;
            proc.write(data)
        },
        getTerminalBuffer:async ():Promise<string>=>terminalBuf,
        onKilled(handler) {
            onExitHandlers.push(handler);
        },
        attach:async():Promise<attachedProcess>=>{
            let detached = false;
            let _attachedDataHandlers:((data:string)=>any)[] = [];
            let _attachedKilledHandlers:any[] = [];
            verbose(`runtty: tty attached`);
            return {
                input(data:string){
                    if (detached || !procAlive) return;
                    proc.write(data);return data;
                },
                resize(size) {
                    if (detached || !procAlive) return;
                    proc.resize(size.cols,size.rows)
                },
                onOutput(handler:(data:string)=>any) {

                    _attachedDataHandlers.push(handler);
                    onDataHandlers.push(handler);
                },
                onKilled(killed_handler) {
                    _attachedKilledHandlers.push(killed_handler);
                    onExitHandlers.push(killed_handler)
                },
                detach() {
                    verbose(`runtty: tty detached`);
                    detached = true;
                    if (_attachedKilledHandlers.length!=0){
                        for(let handler of _attachedKilledHandlers){
                            onExitHandlers.splice(onExitHandlers.indexOf(handler),1)
                        }
                        for(let handlerr of _attachedDataHandlers as ((data:string)=>any)[]){
                            onDataHandlers.splice(onDataHandlers.indexOf(handlerr),1)
                        }
                        
                    }
                },
            } as attachedProcess; 
        }
    } as ranProcess;
    global.module_runtty_runners[key] = ran;
    return ran;
}