import { readdir } from 'fs/promises';
import { Schema, model, connect, Model, disconnect } from 'mongoose';
import path from 'path';
declare global{
    var storage:{[key: string]: Model<any>};
}
export async function init(){
    global.storage={};
    verbose(`mongo: connecting...`);
    await connect('mongodb://127.0.0.1:27017/test');
    verbose(`mongo: connected?`);
    for(var dirent of await readdir(path.resolve(__dirname, 'base/mongo'), {withFileTypes: true})){
        if (dirent.isFile() && dirent.name.endsWith('.js')){
            verbose(`import mongo definition: ${dirent.name}`);
            await (await import('file:'+path.resolve(__dirname, 'base/mongo', dirent.name))).default();
        }
    }
}
export async function stop(){
    verbose(`mongo: disconnecting...`);
    await disconnect();
}