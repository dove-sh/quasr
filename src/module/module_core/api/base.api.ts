import { readFile } from "fs/promises";
import { Request, Response } from "node-fetch";
import path from "path";
import ApiContext from "../../module_api/types/ApiContext";

export default function({app}:ApiContext):void{
    publicRoutes.push('/');
    app.get('/', async (req,res)=>{
        let features:string[] = [];
        for(var mod of Object.values(context.modules)){
            for(var feat of mod.features){
                if (!features.includes(feat)) features.push(feat);
            }
        }
        if (req.headers.accept && req.headers.accept.includes('json')){
            return res.json({quasr: true, version: context.version, features})
        }
        else{
            res.header('content-type','text/html; charset=utf-8');
            res.send((await readFile(path.resolve(__dirname, `brand/${context.brand.id}/http/index.html`))).toString().replaceAll('$ver', context.version).replaceAll('$features',features.join(', ')));
            res.end();
        }
    })
}