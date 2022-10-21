import { timingSafeEqual } from "crypto";
import { Application } from "../module_apps/types/Application";
import { IAppEntry } from "../module_apps/types/IAppEntry";
import { minecraft_config } from "./types/config";

export class MinecraftJavaApp extends Application{
    private _config:minecraft_config;
    constructor(entry:IAppEntry){
        super(entry)
        this._config = this.config as minecraft_config;
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