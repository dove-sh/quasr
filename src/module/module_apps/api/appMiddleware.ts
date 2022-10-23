import { NextFunction, Request, Response, Router } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { getAppInstance, getAppProvider } from "..";
import { HttpRequestHandler } from "../../module_api/types/apiModule";
import { ApplicationApiModule } from "../types/ApplicationModule";

export async function app_middleware (req:Request,res:Response,next:NextFunction){
    let appProvider = await getAppProvider(req.params.appId);
    let appInstance = await getAppInstance(req.params.appId);

    if (!appProvider||!appInstance) return res.json({error: 'app_doesnt_exist'});

    let req_ = req as any;
    req_.current_app = appInstance;

    let router = Router();
    for(var endpoint of (appProvider as any as ApplicationApiModule).application_api){
        if (endpoint.method=='get')
            router.get(endpoint.endpoint, endpoint.handler as HttpRequestHandler);
        if (endpoint.method=='post')
            router.post(endpoint.endpoint, endpoint.handler as HttpRequestHandler);
        if (endpoint.method=='ws')
            router.ws(endpoint.endpoint, endpoint.handler as WebsocketRequestHandler);
        
    }
    await router(req_,res,next);
}