import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({app}:ApplicationApiContext){
    app.get('/status', async (app, req,res)=>{
        let status = await app.status();
        return res.json({ok: true, result: status});
    })
}