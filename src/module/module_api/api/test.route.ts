import { appendFile } from "fs";

export default function(ctx:any):void{
    ctx.app.get('/asdfasdf', (req:any,res:any)=>{
        console.log('asdfasdfafafas');
        return res.json({ok: true});
    })
}