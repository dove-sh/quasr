import { readFile } from "fs/promises";
import { QueryOptions } from "mongoose";
import { Request, Response } from "node-fetch";
import path from "path";
import { createImportSpecifier } from "typescript";
import { event } from "../../../base/mongo/event";
import { dbstate } from "../../../base/mongo/stats";
import ApiContext from "../../module_api/types/ApiContext";

export default function({app}:ApiContext):void{
    app.get('/stats/:from/:key', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;
        let re:dbstate[];
        let params:QueryOptions<any> = {};
        let query:any;
        
        console.log(params);
        if (req.query.dateTo) query = storage.stat.find({from:req.params.from,key:req.params.key, time:{$gte:dateFrom, $lte: parseInt(req.query.dateTo.toString())}}, undefined, params);
        else query = storage.stat.find({from:req.params.from,key:req.params.key, time: {$gte: dateFrom}}, params);
        
        if (req.query.take) query = query.limit(parseInt(req.query.take.toString()));
        if (req.query.skip) query = query.skip(parseInt(req.query.skip.toString()));
        
        re = await query.exec();
        return res.json({result:re.map(e=>{return {from:e.from,desc:e.desc,key:e.key,current:e.current,max:e.max, time:e.time, unit:e.unit}})});
    });
    app.get('/events', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;

        let params:any = {};
        if (req.query.take) params.limit = parseInt(req.query.take.toString());
        if (req.query.skip) params.skip = parseInt(req.query.skip.toString());

        let re:event[];
        if (req.query.dateTo) re = await storage.event.find({time:{$gte:dateFrom, $lte: parseInt(req.query.dateTo.toString())}}, params).exec();
        else re = await storage.event.find({}).exec();
        return res.json({result:re.map(e=>{return {from:e.from, event:e.event, time:e.time}})});
    });
    app.get('/events/:from', async (req,res)=>{
        let dateFrom = req.query.dateFrom ? parseInt(req.query.dateFrom.toString()) : Date.now() - 86400*1000;
        let re:event[];

        let params:any = {};
        if (req.query.take) params.limit = parseInt(req.query.take.toString());
        if (req.query.skip) params.skip = parseInt(req.query.skip.toString());

        if (req.query.dateTo) re = await storage.event.find({from:req.params.from, time:{$lte:dateFrom, $gte: parseInt(req.query.dateTo.toString())}}, params).exec();
        else re = await storage.event.find({from:req.params.from, time:{$gte: dateFrom}}, params).exec();

        return res.json({result:re.map(e=>{return {from:e.from, event:e.event, time:e.time}})});
    })
}