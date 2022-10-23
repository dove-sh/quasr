import { runner } from "../../types/runner";
import * as runtty from './runtty';
import * as ipc_runtty from './ipc_runtty';
declare global{
    var runner:runner
}
export async function module__start(){
    global.module_runtty_runners = {};
    global.runner = {
        create(options, key, tags) {
            if (global.isCli) return ipc_runtty.create(options, key, tags)
            else return runtty.create(options, key, tags);
        },
        find(key){
            if (global.isCli) return ipc_runtty.find(key);
            else return runtty.find(key);
        }
    }
}