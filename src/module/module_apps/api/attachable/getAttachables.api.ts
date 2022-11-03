import { websock } from "../../../../common/ipc";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import { appTerminalSize, AttachableApplication } from "../../types/AttachableApplication";

export default function({app}:ApplicationApiContext){
    app.get('/attachables', async (app, req, res)=>{
        let attachableApp = app as any as AttachableApplication;
        let attachables = await attachableApp.getAttachables();
        return res.json(attachables);
    });

    app.get('/attachables_watch', async (app, req, res)=>{
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

            let attachableApp = app as any as AttachableApplication;
            let attachables = await attachableApp.getAttachables();
            send(attachables);
            
            let interval = setInterval(async ()=>{
                let attachables = await attachableApp.getAttachables();
                send(attachables);
            }, 2500);

            setTimeout(async ()=>{
                clearInterval(interval);
                connectionAlive = false;
                res.end();
                
            }, 30000)
    })

    app.ws('/attach/:to', async (app, ws, req)=>{
        let attachableApp = app as any as AttachableApplication;
        let attach = await attachableApp.attach(req.params.to);
        let detached = false;
        ws.send(await attach.buf())
        ws.on("message", (data, isBinary)=>{
            if (detached) return;

            let asString = data.toString();
            if (asString.startsWith('¡')){
                let json_data = JSON.parse(asString.substring(1));
                if (json_data.ping){
                    ws.send(`¡${JSON.stringify({pong:json_data.ping>=228?0:json_data.ping+1})}`)
                }
                if (json_data.detach){
                    detached = true;
                    attach.detach();
                    ws.close();
                }
                if (json_data.resize&&!detached) attach.resize(json_data.resize as appTerminalSize);
            }
            else attach.input(asString);
        });

        attach.onOutput((data:string)=>{
            if (ws.readyState==ws.OPEN && !detached) ws.send(data);
        })
        attach.onKilled((exitCode:number)=>{
            ws.send(`¡`+JSON.stringify({exit:exitCode}));
            detached = true;
            attach.detach();
            ws.close();
        })
    });

}