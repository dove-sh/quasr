import { IAppEntry } from "./IAppEntry";

export abstract class Application{
    private app:IAppEntry;
    constructor(entry:IAppEntry){
        this.app=entry;
    }
    abstract state():any;
    abstract status():Promise<string>;
}