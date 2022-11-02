import { system_state } from "../../../../common/system_state";
import { state } from "../../../../types/state";
import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({app}:ApplicationApiContext){
    app.get('/state', async (app, req,res)=>{
        
        let state = (await app.state()).concat(await system_state());
        return res.json({ok: true, result:state});
    })
    app.get('/state_watch', async (app, req, res)=>{
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders(); // flush the headers to establish SSE with client
        let connectionAlive = true;
        function send(data:any){
            if (connectionAlive) res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
        res.on('close', ()=>{ end()});
        function end(){
            clearInterval(interval);
            clearInterval(systemInterval);
            
            connectionAlive=false; 
            res.end();
        }
        let appState:state[];
        let systemState:state[];
        systemState = await system_state();
        appState = await app.state();
        send(appState.concat(systemState));
        let systemInterval = setInterval(async ()=>{
            systemState = await system_state();
        }, 7800)
        let interval = setInterval(async ()=>{
            appState = await app.state();
            send(appState.concat(systemState));
        }, 2000);

        setTimeout(async ()=>{
            clearInterval(interval);
            clearInterval(systemInterval);
            connectionAlive = false;
            res.end();
            
        }, 30000)
        
})
}