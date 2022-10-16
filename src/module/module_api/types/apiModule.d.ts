import { NextFunction, Request, RequestHandler, Response } from "express";

interface ApiModule{
    endpoints:ApiEndpoint[]
    api_middlewares:ApiMiddleware[]
}
interface ApiEndpoint{
    endpoint:string, 
    method: 'get'|'post'|'ws'
    handler(req:Request,res:Response):any
}
interface ApiMiddleware{
    endpoint?: string,
    handler(req:Request,res:Response,next:NextFunction):any
}
