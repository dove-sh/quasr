import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({app}:ApplicationApiContext){
    app.get('/state', async (app, req,res)=>{
        let state = await app.state();
        return res.json({ok: true, result:state});
    })
}