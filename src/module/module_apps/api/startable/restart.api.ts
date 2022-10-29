import { wrapPromise } from "../../../../common/promises";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import { StartableApplication } from "../../types/StartableApplication";

export default function({app}:ApplicationApiContext){
    app.post('/restart', async (app, req,res)=>{
        let startable_app = app as unknown as StartableApplication;
        let task = wrapPromise(startable_app.restart(), 'quasr_app_restart');
        return res.json({task});
    });
}