import { NextFunction, Request, Response } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { ApiEndpoint } from "../../module_api/types/apiModule";
import { CliCommand } from "../../module_cli/types/cliCommand";
import { Application } from "./Application";
import { IAppEntry } from "./IAppEntry";
import * as ws from 'ws';
export interface ApplicationModule{
    application: new (entry:IAppEntry)=> Application
}
export interface ApplicationCliModule{
    application_cli: CliCommand[]
}
export type AppHttpRequestHandler = (app:Application, req:Request,res:Response)=>any;
export type AppWebsocketRequestHandler = (app:Application, ws: ws, req: Request) => void;
export interface ApplicationApiEndpoint{
    endpoint:string, 
    method: 'get'|'post'|'ws'
    handler:AppHttpRequestHandler|AppWebsocketRequestHandler
}
export interface ApplicationApiModule{
    application_api: ApplicationApiEndpoint[]
}