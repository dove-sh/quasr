import { Request, RequestHandler, Response } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { Application } from "../../module_apps/types/Application";
import { AppHttpRequestHandler, AppWebsocketRequestHandler } from "./ApplicationModule";

export default interface ApplicationApiContext{
    app:{
        get(endpoint:string,handler:AppHttpRequestHandler):any,
        post(endpoint:string,handler:AppHttpRequestHandler):any,
        ws(endpoint:string,handler:AppWebsocketRequestHandler):any
    }
}