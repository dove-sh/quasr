import { Request, Response } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { appendFile } from "fs";
import { resourceLimits } from "worker_threads";
import { runOptions, runPtySize } from "../../../types/runner";
import * as ws from 'ws';
import { json } from "stream/consumers";
import ApiContext from "../../module_api/types/ApiContext";
export default function({app}:ApiContext):void{
    app.post('/_ipc_runner/create', async (req:Request,res:Response)=>{
        let options = req.body as {options: runOptions, key: string, tags: string[]};
        let result = await runner.create(options.options, options.key, options.tags);
        return res.json(result ? {pid:result.pid, tags:result.tags, key: result.key} : {_undefined:true});
    });
    app.post('/_ipc_runner/find', async (req:Request,res:Response)=>{
        let options = req.body as {key: string};
        let result = await runner.find(options.key);
        return res.json(result ? {pid:result.pid, tags:result.tags, key: result.key} : {_undefined:true});
    });
    app.post('/_ipc_runner/event_onKilled', async (req:Request,res:Response)=>{
        let instance = await runner.find(req.body.key);
        instance.onKilled((exitCode:number)=>{
            return res.json({exitCode});
        })
    });
    app.post('/_ipc_runner/alive', async (req:Request,res:Response)=>{
        let instance = await runner.find(req.body.key);
        return res.json({alive:await instance.alive()});
    });
    app.post('/_ipc_runner/kill', async (req:Request,res:Response)=>{
        let instance = await runner.find(req.body.key);
        instance.kill();
        return res.json(true);
    });
    app.post('/_ipc_runner/push', async (req:Request, res:Response)=>{
        let instance = await runner.find(req.body.key);
        instance.push(req.body.data);
        return res.json(req.body.data);
    })
    app.ws('/_ipc_runner/attach/:key', async (ws:ws, req:Request)=>{
        let instance = await runner.find(req.params.key);
        let attach = await instance.attach();
        let detached = false;
        ws.on("message", (data:ws.RawData, isBinary: boolean)=>{
            if (detached) return;

            let asString = data.toString();
            if (asString.startsWith('¡')){
                let json_data = JSON.parse(asString.substring(1));
                if (json_data.detach){
                    detached = true;
                    attach.detach();
                    ws.close();
                }
                if (json_data.resize&&!detached) attach.resize(json_data.resize as runPtySize);
            }
            else attach.input(asString);
        });
        attach.onOutput((data:string)=>{
            if (ws.readyState==ws.OPEN && !detached) ws.send(data);
        })
        attach.onKilled((exitCode:number)=>{
            ws.send(`¡`+JSON.stringify({exitCode}));
            detached = true;
            attach.detach();
            ws.close();
        })
    })
}