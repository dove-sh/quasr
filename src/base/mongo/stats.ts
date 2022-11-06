import { model, Schema, Types } from "mongoose"
import { state } from "../../types/state";
export interface dbstate extends state{
    from:string
    time:number
}

export default async function(){
    var schema = new Schema<dbstate>({ key:String,
        desc:String,
        unit:String,
        current:Schema.Types.Mixed,
        max:Schema.Types.Mixed,
    from:String,time:Number }, {strict: false});
    storage.stat = model('stats', schema);
} 
export async function stat(s:state, f:string,time:number=-1){
    if (time==-1)time=Date.now();
    var st = new storage.stat({key:s.key, unit:s.unit, current:s.current, max: s.max, desc: s.desc, from: f, time});
    await st.save();
    return st;
}
export async function stats(s:state[], f:string, time:number=-1){
    if (time==-1)time=Date.now();
    for(var st of s){
        await stat(st,f,time)
    }
}
