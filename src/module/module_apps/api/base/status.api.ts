import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({app}:ApplicationApiContext){
    app.get('/status', async (app, req,res)=>{
        let status = await app.status();
        return res.json({ok: true, result: status});
    });
    app.get('/status_watch', async (app, req, res)=>{
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders(); // flush the headers to establish SSE with client
            let connectionAlive = true;
            function send(data:any){
                if (connectionAlive) res.write(`data: ${JSON.stringify(data)}\n\n`);
            }
            res.on('close', ()=>{end()});
            function end(){
                clearInterval(interval);
                connectionAlive=false; 
                res.end();
            }

            let status = await app.status();
                send(status);
            
            let interval = setInterval(async ()=>{
                let status = await app.status();
                send(status);
            }, 2500);

            setTimeout(async ()=>{
                clearInterval(interval);
                connectionAlive = false;
                res.end();
                
            }, 30000)
            
    })
}