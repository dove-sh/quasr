import { model, Schema } from "mongoose"
export interface event{
    time:number,
    event:string,
    from:string
}
export default async function(){
    var schema = new Schema<event>({time:Number, event:String,from:String });
    storage.event = model('events', schema);
} 
export async function event(event:string,from:string,desc?:string,time:number=-1){
    if (time==-1)time=Date.now();
    var ev = new storage.event({time,event,from});
    await ev.save();
    return ev;
}