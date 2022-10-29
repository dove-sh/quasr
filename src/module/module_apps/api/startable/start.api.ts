import { wrapPromise } from "../../../../common/promises";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import { StartableApplication } from "../../types/StartableApplication";

export default function({app}:ApplicationApiContext){
    app.post('/start', async (app, req, res)=>{
        let startable_app = app as unknown as StartableApplication;
        let task = wrapPromise(startable_app.start(), 'quasr_app_start');
        return res.json({task});
    });
}