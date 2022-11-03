import { NextFunction, Request, Response } from "express";
import { check, chk } from ".";

export async function access_middleware (req:Request,res:Response,next:NextFunction){
    //verbose(`dove_env: trying to implement middleware`);
    if (await chk(req) || req.path.endsWith('_access/session_key')) next();
    else return res.status(403).json({session__expired: true})
}