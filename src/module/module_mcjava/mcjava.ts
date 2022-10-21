import { timingSafeEqual } from "crypto";
import { Application } from "../module_apps/types/Application";
import { IAppEntry } from "../module_apps/types/IAppEntry";
import { minecraft_config } from "./types/config";
import Downloader from 'nodejs-file-downloader';
import Seven from 'node-7z'
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import vanilla_configure from "./utils/vanilla_configure";
import { existsSync, mkdirSync } from "fs";
export class MinecraftJavaApp extends Application{
    private _config:minecraft_config;
    constructor(entry:IAppEntry){
        super(entry)
        
        this._config = this.config as minecraft_config;
        if (!this._config) this._config ={startup:{jarPath: undefined, xms: undefined, xmx: undefined}, forceConfigure: undefined, dir: undefined};
        if (!this._config.startup) this._config.startup = {jarPath: undefined, xms: undefined, xmx: undefined};
        if (!this._config.dir) {this._config.dir = this.getNewAppPath(); this.saveConfig(this._config);}

        if (!existsSync(this._config.dir)) mkdirSync(this._config.dir, {recursive: true});


    }
    public async init() {
        print(`creating minecraft:java edition server...`);
        let load = `https://piston-data.mojang.com/v1/objects/f69c284232d7c7580bd89a5a4931c3581eae1378/server.jar`;
        if (global.config.mcjava&&global.config.mcjava.init&&global.config.mcjava.init_files)
            load = global.config.mcjava.init_files;
        let dest:string;
        if (load.startsWith('http')){
            print(`downloading initial files`);
            verbose(`download url: ${load}`);
            const downloader = new Downloader({
                url: load, directory: this._config.dir as string
            });
            let report = await downloader.download();
            dest = report.filePath;
            if (report.downloadStatus != 'COMPLETE') throw Error('mc download is aborted.');
        }
        else {
            dest = path.resolve(this._config.dir as string, path.parse(load).name);
            await copyFile(load, dest)
        };
        verbose(`initializing from ${dest}`);
        if (dest.endsWith('.zip')||dest.endsWith('.tar')
        ||dest.endsWith('gz')||dest.endsWith('.7z')){
            print(`extracting..`);
            var zip = Seven.extractFull(dest, this._config.dir as string,
                {});
            await new Promise(p=>zip.on('end',p));
            
        }
        else if (dest.endsWith('.jar')){
            this._config.startup.jarPath = dest;
        }
        else throw new Error('unknown file type: '+dest);
        print('almost done');
        await this.configure();
        
    }
    public async configure(){
        this._config = await vanilla_configure(this._config, this.app.app_id);
        await this.saveConfig(this._config);
    }
    public state() {
        throw new Error("Method not implemented.");
    }
    public status(): Promise<string> {
        throw new Error("Method not implemented.");
    }

}