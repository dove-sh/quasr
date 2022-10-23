import { spawn } from "node-pty";
import { exitCode } from "process";
import { attachedProcess, ranProcess, runner, runOptions } from "../../types/runner";

declare global{
    var module_runtty_runners:{[key:string]:ranProcess};
}
export async function find(key:string){
    return global.module_runtty_runners[key];
}
export async function create(options:runOptions,key:string,tags:string[]=[]):Promise<ranProcess>{
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
    proc.onData((e:string)=>{
        for(var dataHandler of onDataHandlers) dataHandler(e)
    });

    let ran = {
        tags, key,
        pid:proc.pid,
        alive:()=>procAlive,
        kill:()=>proc.kill(),
        push(data:string){
            if (!procAlive) return;
            proc.write(data)
        },
        onKilled(handler) {
            onExitHandlers.push(handler);
        },
        attach:async():Promise<attachedProcess>=>{
            verbose(`runtty: tty attached`);
            return {
                input(data:string){
                    if (this.detached || !procAlive) return;
                    proc.write(data);return data;
                },
                resize(size) {
                    if (this.detached || !procAlive) return;
                    proc.resize(size.cols,size.rows)
                },
                onOutput(handler:(data:string)=>any) {
                    if(!this._attachedDataHandlers)this._attachedDataHandlers=[] as ((data:string)=>any)[];
                    this._attachedDataHandlers.push(handler);
                    onDataHandlers.push(handler);
                },
                onKilled(handler) {
                    if (!this._attachedKilledHandlers)this._attachedKilledHandlers=[] ;
                    this._attachedKilledHandlers.push(handler);
                    onExitHandlers.push(handler)
                },
                detach() {
                    verbose(`runtty: tty detached`);
                    this.detached = true;
                    if (this._attachedKilledHandlers){
                        for(var handler of this._attachedKilledHandlers){
                            onExitHandlers.splice(onExitHandlers.indexOf(handler),1)
                        }
                        for(var handlerr of this._attachedDataHandlers as ((data:string)=>any)[]){
                            onDataHandlers.splice(onDataHandlers.indexOf(handler),1)
                        }
                        
                    }
                },
            } as attachedProcess; 
        }
    } as ranProcess;
    global.module_runtty_runners[key] = ran;
    return ran;
}