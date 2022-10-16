import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({api}:ApplicationApiContext){
    api.get('/state', async (req,res)=>{
        let app = (req as any).current_app;
        
        let state = await app.state();
        return res.json({ok: true, state:state});
    })
}