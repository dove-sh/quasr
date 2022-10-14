import { RequestHandler } from "express";

interface ApiModule{
    endpoints:ApiEndpoint[]
}
interface ApiEndpoint{
    endpoint:string, 
    method: 'get'|'post'|'ws'
    handler: RequestHandler;
}
