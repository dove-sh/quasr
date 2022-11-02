import { Request, Response } from "node-fetch";
import { sseTask } from "../../../common/promises";
import ApiContext from "../../module_api/types/ApiContext";

export default function({app}:ApiContext):void{
    app.get('/task/:taskId', async (req, res)=>{
        var task = global.tasks.find(t=>t.id==req.params.taskId);
        if (!task) return res.json({error:'no such task'});
        let state = await task.getState();
        return res.json({result:state});
    });
    app.get('/task/:taskId/watch', async (req,res)=>{
        var task = global.tasks.find(t=>t.id==req.params.taskId);
        sseTask(task, req, res);
    })
    app.ws('/task/:taskId/ws', async (ws,req)=>{
        var task = global.tasks.find(t=>t.id==req.params.taskId);
        ws.on('open', async ()=>{
            if (!task) ws.send(JSON.stringify({error: 'no such task'})), ws.close();
            else ws.send(JSON.stringify(await task.getState()));
        });
        task.promise.then(async ff=>{if (ws.readyState == ws.OPEN)ws.send(JSON.stringify(await task.getState()))},
        async rj=>{if (ws.readyState == ws.OPEN)ws.send(JSON.stringify(await task.getState()))});
    });
}