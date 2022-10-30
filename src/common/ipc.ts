import { writeSync } from 'fs';
import * as http from 'http';
import fetch from 'node-fetch';
import ws from 'ws';
export function req(endpoint:string, data:any={}, method:'post'|'get'='post'):Promise<any>{
    if (process.platform=='linux' && global.config.api.unixListen) 
         return unix_req(endpoint, data, method);
    else return http_req(endpoint, data, method);
}
export function websock(endpoint: string):ws{
    if (process.platform=='linux' && global.config.api.unixListen) 
         return unix_ws(endpoint);
    else return tcp_ws(endpoint);
}
export function tcp_ws(endpoint: string):ws{
    
    var websock = new ws('ws://' + (global.config.api.httpListen.replaceAll('0.0.0.0','127.0.0.1') ?? '127.0.0.1:7827') +endpoint);
    return websock;
}
export function unix_ws(endpoint: string):ws{
    let con = `ws+unix:${global.config.api.unixListen ?? '/var/run/quasr_api.sock'}:${endpoint}`;
    verbose(`connect to unix ws: ${con}`)
    var websock = new ws(con);
    return websock;
}
export async function http_req(endpoint:string, data:any={}, method:'post'|'get'='post'):Promise<any>{
    var path = 'http://' + (global.config.api.httpListen.replaceAll('0.0.0.0','127.0.0.1') ?? '127.0.0.1:7827') + endpoint;
    return await fetch('http://' + (global.config.api.httpListen.replaceAll('0.0.0.0','127.0.0.1') ?? '127.0.0.1:7827') + endpoint, {
        method, headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    }).then(r=>r.json());
}
export function unix_req(endpoint:string, data:any={}, method:'post'|'get'='post'):Promise<any>{
	return new Promise((resolve, reject) =>{
		let request = http.request({
			socketPath: global.config.api.unixListen ?? '/var/run/quasr_api.sock',
			path: endpoint,
			method, headers: {'Content-Type':'application/json'}
		}, res=>{
			let bufs:any[] = [];
			res.setEncoding('utf8');
			res.on('data', chunk=>bufs+=chunk);
			res.on('end', () => resolve(JSON.parse(bufs.toString())));
		});

		request.on('error', (e) => reject(e.message));
		request.write(JSON.stringify(data));
		request.end();
	})
	
}