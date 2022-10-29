import { NextFunction, Request, Response, Router } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { getAppInstance, getAppProvider } from "..";
import { HttpRequestHandler } from "../../module_api/types/apiModule";
import { Application } from "../types/Application";
import { AppHttpRequestHandler, ApplicationApiModule, AppWebsocketRequestHandler } from "../types/ApplicationModule";
import * as ws from 'ws';
export async function app_middleware (req:Request,res:Response,next:NextFunction){
    verbose('app: trying to implement middleware')
    let appProvider = await getAppProvider(req.params.appId);
    let appInstance = await getAppInstance(req.params.appId);

    if (!appProvider||!appInstance) return res.json({error: 'app_doesnt_exist'});


    let router = Router();
    for(var endpoint of (appProvider as any as ApplicationApiModule).application_api){
        let currentHandler = endpoint.handler;
        if (endpoint.method=='get')
            router.get(endpoint.endpoint, async (req: Request, res: Response) =>{
                await (currentHandler as AppHttpRequestHandler)(appInstance as Application,req,res);
            });
        if (endpoint.method=='post')
            router.post(endpoint.endpoint, async (req: Request, res: Response)=>{
                await (currentHandler as AppHttpRequestHandler)(appInstance as Application,req,res);
            });
        if (endpoint.method=='ws')
            router.ws(endpoint.endpoint, async (ws: ws, req: Request) => {
                await (currentHandler as AppWebsocketRequestHandler)(appInstance as Application, ws, req)
            }); 
    }
    await router(req,res,next);
}