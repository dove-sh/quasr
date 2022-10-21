import { model, Schema } from "mongoose"
import { availablePortDefinition } from "../../types/port";

export interface UsedPort{
    usedBy:{module: string, [key: string]:any},
    ip: string,
    port: number
}
export default async function(){
    /* publicIp:string,
    port:number,
    for:string,
    privateIp:'0.0.0.0'|string*/
    var schema = new Schema<UsedPort>({ ip: String, port: Number, usedBy: Object});
    storage.usedPorts = model('UsedPorts', schema);
} 