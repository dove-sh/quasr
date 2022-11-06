import { readFile } from "fs/promises";
import { Request, Response } from "node-fetch";
import path from "path";
import { event } from "../../../base/mongo/event";
import { dbstate } from "../../../base/mongo/stats";
import ApiContext from "../../module_api/types/ApiContext";

export default function({app}:ApiContext):void{
    app.get('/stats/:from/:key', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;
        let re:dbstate[];
        if (req.query.dateTo) re=await storage.stat.find({from:req.params.from,key:req.params.key, time:{$gte:dateFrom, $lte: parseInt(req.query.dateTo.toString())}}).exec();
        else re=await storage.stat.find({from:req.params.from,key:req.params.key, time: {$gte: dateFrom}}).exec();
        
        return res.json({result:re.map(e=>{return {from:e.from,desc:e.desc,key:e.key,current:e.current,max:e.max, time:e.time, unit:e.unit}})});
    });
    app.get('/events', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;

        let re:event[];
        if (req.query.dateTo) re = await storage.event.find({time:{$gte:dateFrom, $lte: parseInt(req.query.dateTo.toString())}}).exec();
        else re = await storage.event.find({}).exec();
        return res.json({result:re.map(e=>{return {from:e.from, event:e.event, time:e.time}})});
    });
    app.get('/events/:from', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;
        let re:event[];
        if (req.query.dateTo) re = await storage.event.find({from:req.params.from, time:{$lte:dateFrom, $gte: parseInt(req.query.dateTo.toString())}}).exec();
        else re = await storage.event.find({from:req.params.from, time:{$gte: dateFrom}}).exec();

        return res.json({result:re.map(e=>{return {from:e.from, event:e.event, time:e.time}})});
    })
}