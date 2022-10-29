import path from "node:path";
import { implementDirSync } from "../../../module_api";
import { ApplicationApiEndpoint } from "../../types/ApplicationModule";

export function implementDefaultApi_startable():Promise<ApplicationApiEndpoint[]>{
    return implementDirSync<ApplicationApiEndpoint>(path.resolve(__dirname,'module','module_apps','api','startable'));
}