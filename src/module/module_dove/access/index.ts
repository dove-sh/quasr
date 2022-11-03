import { Request } from "express";

export async function check(key:string):Promise<boolean>
{
	let sessions = await storage.dove_auth_sessions.find({key:key, expire: {$gte: Date.now()}}).exec();
	return sessions.length!==0;
}
export async function chk(req:Request):Promise<boolean>{

	if (!req.headers.proxied && !req.headers['x-forwarded-for']) return true;

	let authk;
	
	if (req.params&&req.params.auth)authk=req.params.auth;
	else if (req.query && req.query.auth)authk=req.query.auth.toString();
	else if (req.headers&&req.headers.authorization) authk = req.headers.authorization.replaceAll('Bearer','').replaceAll(' ','');
	//verbose(`dove_env: check authkey ${authk}`);
	return check(authk);
}