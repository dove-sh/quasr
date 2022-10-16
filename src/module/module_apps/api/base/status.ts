import ApplicationApiContext from "../../types/ApplicationApiContext";

export default function({api}:ApplicationApiContext){
    api.get('/state', async (req,res)=>{
        let app = (req as any).current_app;
        
        let status = await app.status();
        return res.json({ok: true, status});
    })
}