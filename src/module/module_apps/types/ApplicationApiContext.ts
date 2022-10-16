import { Request, RequestHandler, Response } from "express";
import { Application } from "./Application";

export default interface ApplicationApiContext{
    api:{
        get(endpoint:string,handler:RequestHandler):any,
        post(endpoint:string,handler:RequestHandler):any,
        ws(endpoint:string,handler:RequestHandler):any
    }
}