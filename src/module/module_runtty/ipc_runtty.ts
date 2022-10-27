import { req, websock } from "../../common/ipc";
import { attachedProcess, ranProcess, runner, runOptions, runPtySize } from "../../types/runner";
import WebSocket from 'ws';
import deasync from 'deasync';
import { json } from "stream/consumers";
async function get(result:{pid:number, tags:string[], key: string, _undefined?:boolean}):Promise<ranProcess>{
    if (result._undefined){verbose(`runtty: daemon returned undefined when tried to proxy tty!!!`); return undefined;}
    verbose(`runtty: [${result.key}] proxying daemon child process, pid ${result.pid}`);
    return {
        tags: result.tags, key: result.key, pid: result.pid,
        onKilled(handler) {
            req('/_ipc_runner/event_onKilled', {key: result.key}).then(r=>{
                verbose(`runtty: [${result.key}] got from daemon that process has been killed with exitCode ${r.exitCode}`);
                handler(r.exitCode)});
        },
        kill() {
            verbose(`runtty: [${result.key}] proxied killing`);
            req('/_ipc_runner/kill', {key:result.key})
        }, 
        async alive():Promise<boolean>{
            return (await req('/_ipc_runner/alive', {key:result.key}) as {alive:boolean}).alive;
        },
        push(data) {
            req('/_ipc_runner/push', {key:result.key, data:data})
        },
        async attach():Promise<attachedProcess>{
            verbose(`runtty: [${result.key}] proxy attaching...`);
            let ws = websock('/_ipc_runner/attach/'+result.key);
            let onOutputListeners:((data:string)=>any)[] = [];
            let onKilledListeners:((exitCode: number) => any)[] = [];
            let alive = true;
            verbose(`runtty: [${result.key}] connection: ${ws.readyState}`);
            ws.on('close', (code: number, reason: Buffer)=>{
                verbose(`runtty: [${result.key}] connection closed with code ${code}`);
                verbose(`runtty: reason is ${reason.toString()}`);
            });
            ws.on('error', (err: Error)=>{
                verbose(`runtty: [${result.key}] connection error: ${err.toString()}`)
            })
            ws.on('open', ()=>{
                verbose(`runtty: [${result.key}] connection opened`);
            })
            ws.on('message', (data:WebSocket.RawData, isBinary:boolean)=>{
                if (data.toString().startsWith('¡')){
                    var jsonData = JSON.parse(data.toString().substring(1));
                    if (jsonData.exitCode){
                        verbose(`runtty: [${result.key}] got from attached daemon that process has been killed with exitCode ${jsonData.exitCode} `);
                        alive = false;
                        for(var listener1 of onKilledListeners) listener1(jsonData.exitCode);
                    }
                }
                for(var listener of onOutputListeners) listener(data.toString());
            })
            return{
                input(data:string) {
                    if (ws.readyState==ws.OPEN) ws.send(data);
                    return data;
                },
                resize(size:runPtySize){
                    if (ws.readyState==ws.OPEN) ws.send('¡'+JSON.stringify({resize:size}))
                },
                onOutput(handler) {
                    onOutputListeners.push(handler)
                },
                onKilled(handler) {
                    onKilledListeners.push(handler)
                },
                detach() {
                    verbose(`runtty: [${result.key}] asking daemon to detach proxy (ws)`);
                    ws.send('¡'+JSON.stringify({detach: true}));
                }
            } as attachedProcess
        }
    } as ranProcess
}
export async function create(options:runOptions,key:string,tags:string[]=[]):Promise<ranProcess>{
    let result = await req('/_ipc_runner/create', {options, key, tags}) as {pid:number, tags:string[], key: string}
    return await get(result);
}
export async function find(key:string):Promise<ranProcess>{
    let result = await req('/_ipc_runner/find', {key}) as {pid:number, tags:string[], key: string}
    return await get(result);
}