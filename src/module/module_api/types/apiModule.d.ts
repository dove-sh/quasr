import { NextFunction, Request, RequestHandler, Response } from "express";
import { WebsocketRequestHandler } from "express-ws";
import { request } from "http";
type HttpRequestHandler = (req:Request,res:Response)=>any;
interface ApiModule{
    endpoints:ApiEndpoint[]
    api_middlewares:ApiMiddleware[]
    api_middleware_order?:number
}
interface ApiEndpoint{
    endpoint:string, 
    method: 'get'|'post'|'ws'|'put'
    handler:HttpRequestHandler|WebsocketRequestHandler
}
interface ApiMiddleware{
    endpoint?: string,
    handler(req:Request,res:Response,next:NextFunction):any
    api_middleware_order?:number
}
