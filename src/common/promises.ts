import crypto from 'crypto';
import { Request, Response } from 'express';
declare global{
    var tasks:runningTask[];
}
if (!global.tasks)global.tasks=[];
async function getTaskState():Promise<promiseState>{
	const t = {};
  	let promiseState:"rejected" | "pending" | "fulfilled" = await Promise.race([this.promise, t])
    .then(v => (v === t)? "pending" : "fulfilled", () => "rejected");

    let ret:promiseState = {start:this.start,id:this.id,name:this.name,promiseState};

	if (promiseState=="pending"){
		ret.end=null;
		ret.elapsed = (Date.now()-this.start)/1000;
	}
    
	else if (promiseState=="fulfilled" || promiseState=="rejected"){
		ret.end = 1;
		ret.fault = null;
		try{
			let result = await this.promise;
			if (result&&result.PROMISE_REJECTED){
				ret.promiseState = "rejected";
				ret.fault = result.PROMISE_REJECTED;
				console.log(result.PROMISE_REJECTED);
			}
			else ret.result = result;
		}catch(exception){
			console.log(exception);
			ret.fault = exception.toString()};
	} 


	return ret;
}
interface promiseState{
    start: Date;
    id: string;
    name: string;
    promiseState: 'pending'|'rejected'|'fulfilled';
    end?:number,
    elapsed?:number,
    fault?:any,
    result?:any
}
interface runningTask{
    id:string, name: string, 
    promise:Promise<any>,
    start:number,
    getState():Promise<promiseState>
}
export function wrapPromise(task:Function|Promise<any>,name="task"){
	let taskId = crypto.randomUUID().replaceAll('-','')
	let newTask = {
		id: taskId,
		name,
		promise: 
        task instanceof Function ? task().then(function (e:any){return e}).catch(function (e:any){return {PROMISE_REJECTED:e.toString()} })
        : task instanceof Promise ? task.then(function (e:any){return e}).catch(function (e:any){return {PROMISE_REJECTED:e.toString()} })
        : false,
		start: Date.now(),
		getState: getTaskState
	};
	global.tasks.push(newTask);
	return newTask;
}
export async function sseTask(task:runningTask, req: Request, res:Response){
	console.log('task sse implemented');
		res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
		
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders(); // flush the headers to establish SSE with client
        function send(data:any){
            if (connectionAlive) res.write('data: '+JSON.stringify(data)+'\n\n');
        }
        function end(){
			if (connectionAlive) send({stream_end: true});
			connectionAlive=false; res.end();
		}

        let connectionAlive = true;
		send(await task.getState());

        if (!task) { send({error: 'no such task', stream_end: true}); return end();}
        res.on('end', ()=>{connectionAlive = false; end();})

        
        task.promise.then(async ff=>{
			if (connectionAlive){send(await task.getState()); end();}
		},
        async rj=>{if (connectionAlive){send(await task.getState()); end();}});
}
export function getTasks(){
	return global.tasks;
}