import { existsSync, fstat, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { ConfigFileDiagnosticsReporter } from "typescript";
import * as YAML from 'yaml'
import { IAppEntry } from "./IAppEntry";

export interface IAppConfiguration{
    [key: string]:any
}
export abstract class Application{
    protected app:IAppEntry;
    protected config:IAppConfiguration;
    constructor(entry:IAppEntry){
        if (!existsSync(entry.app_config_path)) {
            if (!existsSync(path.dirname(entry.app_config_path)))
                mkdirSync(path.dirname(entry.app_config_path), {recursive: true});
            writeFileSync(entry.app_config_path, '');
        }
        let app_config = 
        (entry.app_config_path.endsWith('.yml')||entry.app_config_path.endsWith('.yaml'))? 
        YAML.parse(readFileSync(entry.app_config_path).toString())
        : JSON.parse(readFileSync(entry.app_config_path).toString());

        
        this.config = app_config ? app_config as IAppConfiguration : {};
        this.app=entry;
    }
    abstract init():any;
    abstract state():any;
    abstract status():Promise<string>;
}