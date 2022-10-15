import { model, Schema } from "mongoose";

export async function init(){
    storage.test = model('Test', new Schema({
        test: String
    }));

}