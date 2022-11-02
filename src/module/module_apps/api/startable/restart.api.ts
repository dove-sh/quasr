import { sseTask, wrapPromise } from "../../../../common/promises";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import { StartableApplication } from "../../types/StartableApplication";

export default function({app}:ApplicationApiContext){
    app.get('/restart', async (app, req,res)=>{
        let startable_app = app as unknown as StartableApplication;
        let task = wrapPromise(startable_app.restart(), 'quasr_app_restart');
        console.log(req.query.wait);
        console.log(req.query);
        if (!req.query.wait) {console.log('no wait'); return res.json({task});}
        else await sseTask(task, req, res);
    });
}