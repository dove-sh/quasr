import { init, stop } from "./module_mongo";

export default {
    id: 'mongo',
    name: 'MongoDB Client',
    describe: 'npm mongoose as module', 
    by: 'fearfeth', 
    features: ['mongo'],
    depends: [], 
    load: init,
    stop: stop
} as Module