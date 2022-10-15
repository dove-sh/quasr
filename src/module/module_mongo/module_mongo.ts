import { Schema, model, connect, Model, disconnect } from 'mongoose';
declare global{
    var storage:{[key: string]: Model<any>};
}
export async function init(){
    global.storage={};
    verbose(`mongo: connecting...`);
    await connect('mongodb://127.0.0.1:27017/test');
    verbose(`mongo: connected?`);
}
export async function stop(){
    verbose(`mongo: disconnecting...`);
    await disconnect();
}