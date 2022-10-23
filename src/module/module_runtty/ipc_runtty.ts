import { req, websock } from "../../common/ipc";
import { attachedProcess, ranProcess, runner, runOptions, runPtySize } from "../../types/runner";
import WebSocket from 'ws';
import { json } from "stream/consumers";
async function get(result:{pid:number, tags:string[], key: string}):Promise<ranProcess>{
    return {
        tags: result.tags, key: result.key, pid: result.pid,
        onKilled(handler) {
            req('/_ipc_runner/event_onKilled', {key: result.key}).then(r=>r.json()).then(r=>handler(r.exitCode));
        },
        kill() {
            req('/_ipc_runner/kill', {key:result.key}).then(r=>r.json())
        }, 
        alive():boolean{
            let alive:boolean|undefined = undefined;
            req('/_ipc_runner/alive', {key:result.key}).then(r=>r.json()).then(r=>{
                alive = r.alive;
            });
            while(typeof alive === 'undefined'){}
            return alive;
        },
        push(data) {
            req('/_ipc_runner/push', {key:result.key, data:data}).then(r=>r.json())
        },
        async attach():Promise<attachedProcess>{
            let ws = websock('/_ipc_runner/attach/'+result.key);
            let onOutputListeners:((data:string)=>any)[] = [];
            let onKilledListeners:((exitCode: number) => any)[] = [];
            let alive = true;
            console.log(ws.readyState);
            ws.on('close', (code: number, reason:Buffer)=>{console.log('close '+code); console.log(reason)})
            ws.on('error', (err: Error)=>console.log(err));
            
            ws.on('message', (data:WebSocket.RawData, isBinary:boolean)=>{
                console.log('ws data recv');
                if (data.toString().startsWith('¡')){
                    var jsonData = JSON.parse(data.toString().substring(1));
                    if (jsonData.exitCode){
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
                    ws.send('¡'+JSON.stringify({detach: true}));
                }
            } as attachedProcess
        }
    } as ranProcess
}
export async function create(options:runOptions,key:string,tags:string[]=[]):Promise<ranProcess>{
    verbose({options, key, tags});
    let result = await req('/_ipc_runner/create', {options, key, tags}) as {pid:number, tags:string[], key: string}
    return await get(result);
}
export async function find(key:string):Promise<ranProcess>{
    let result = await req('/_ipc_runner/find', {key}) as {pid:number, tags:string[], key: string}
    return await get(result);
}