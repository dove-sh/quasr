import { existsSync, fstat, mkdirSync, readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import { platform } from "os";
import path from "path";
import { openStdin } from "process";
import { ConfigFileDiagnosticsReporter } from "typescript";
import * as YAML from 'yaml'
import { IAppEntry } from "./IAppEntry";

export interface IAppConfiguration{
    [key: string]:any
}
export function getNewAppConfigPath(appId:string){
    if (process.platform == 'win32') return path.resolve(process.env.APPDATA, `Quasr\\app_${appId}.yml`);
    else return `/etc/app_${appId}.yml`
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
    protected async saveConfig(config?:IAppConfiguration){
        (this.app.app_config_path.endsWith('.yml')||this.app.app_config_path.endsWith('.yaml'))?
        await writeFile(this.app.app_config_path, YAML.stringify(config??this.config))
        :await writeFile(this.app.app_config_path, JSON.stringify(config??this.config));
    }

    protected getNewAppPath(){
        if (process.platform == 'win32') return path.resolve(process.env.APPDATA,`Quasr\\app_${this.app.app_id}`);
        else return `/var/app_${this.app.app_id}`
    }
    abstract init():any;
    abstract state():any;
    abstract status():Promise<string>;
}