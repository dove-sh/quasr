import { timingSafeEqual } from "crypto";
import { Application } from "../module_apps/types/Application";
import { IAppEntry } from "../module_apps/types/IAppEntry";

export class MinecraftJavaApp extends Application{

    constructor(entry:IAppEntry){
        console.log('mc consturcetd lol');
        super(entry)
    }
    public async init() {
        console.log('init called lol');
    }
    public state() {
        throw new Error("Method not implemented.");
    }
    public status(): Promise<string> {
        throw new Error("Method not implemented.");
    }

}