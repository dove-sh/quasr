import { Schema, model } from "mongoose";
import { IAppEntry } from "./types/IAppEntry";

export async function module_start(){

}
export async function module_load(){
    const appSchema = new Schema<IAppEntry>
    ({},
        {strict: false, strictQuery: false});
    storage.app = model('apps', appSchema);
    verbose('apps: set storage.app');
}