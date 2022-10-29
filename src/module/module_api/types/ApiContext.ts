import { Request, RequestHandler, Response } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { Application } from "../../module_apps/types/Application";

export default interface ApiContext{
    app:{
        get(endpoint:string,handler:RequestHandler):any,
        post(endpoint:string,handler:RequestHandler):any,
        ws(endpoint:string,handler:WebsocketRequestHandler):any
    }
}