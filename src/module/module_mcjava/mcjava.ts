import { Application } from "../module_apps/types/Application";
import { StartableApplication } from "../module_apps/types/StartableApplication";
import { IAppEntry } from "../module_apps/types/IAppEntry";

import { minecraft_config } from "./types/config";
import Downloader from 'nodejs-file-downloader';
import Seven from 'node-7z'
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import vanilla_configure from "./utils/vanilla_configure";
import { existsSync, mkdirSync } from "fs";

import { Mixin } from 'ts-mixer';

import os from 'node:os';

import { applicationPlayer, applicationStatus } from "../module_apps/types/ApplicationStatus";
import * as server_properties from './utils/server_properties';
import * as util from 'minecraft-server-util';
import { getPublicIp } from "../../common/search_port";
import { state } from "../../types/state";
import { appAttachable, appTerminal, AttachableApplication } from "../module_apps/types/AttachableApplication";
import { terminal } from "../module_apps/terminal";
import { event } from "../../base/mongo/event";
import {stats} from "../../base/mongo/stats";

export class MinecraftJavaApp extends Mixin(Application, StartableApplication, AttachableApplication){
    

    private _config:minecraft_config;
    constructor(entry:IAppEntry){
        super(entry)
        
        this._config = this.config as minecraft_config;
        if (!this._config) this._config ={startup:{jarPath: undefined, win32JavaPath: undefined, xms: undefined, xmx: undefined}, forceConfigure: undefined, dir: undefined};
        if (!this._config.startup) this._config.startup = {jarPath: undefined, xms: undefined, xmx: undefined, win32JavaPath: undefined};
        if (!this._config.dir) {this._config.dir = this.getNewAppPath(); this.saveConfig(this._config);}

        if (!existsSync(this._config.dir)) mkdirSync(this._config.dir, {recursive: true});


    }

    private getMemSizeMiB(min=0,max=0){
        let memSizeMib = Math.floor(os.totalmem()/1024/1024);
        if (min!=0 && memSizeMib<min) return min;
        if (max!=0 && memSizeMib>max) return max;
        return memSizeMib;
    }
    public async init() {
        await event('quasr_app_created', this.app.app_id);
        let load = `https://piston-data.mojang.com/v1/objects/f69c284232d7c7580bd89a5a4931c3581eae1378/server.jar`;
        if (global.config.mcjava&&global.config.mcjava.init&&global.config.mcjava.init_files)
            load = global.config.mcjava.init_files;
        let dest:string;
        if (load.startsWith('http')){
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
        await this.configure();
        
    }
    public async configure(){
        this._config = await vanilla_configure(this._config, this.app.app_id);
        await this.saveConfig(this._config);
    }
    public async start(): Promise<any> {
        await event('quasr_app_start', this.app.app_id);
        var maybeProcessAlreadyRunning = await runner.find(`app__${this.app.app_id}`);
        if (maybeProcessAlreadyRunning&&(await maybeProcessAlreadyRunning.alive())) throw Error(`application is already running (pid: ${maybeProcessAlreadyRunning.pid})`)

        await this.configure();
        let jar = this._config.startup.jarPath;
        if (jar === 'auto') throw new Error('jarPath: auto is not supported');
        let startup = [
        `-Xmx${this._config.startup.xmx ?? this.getMemSizeMiB()}M`,
        `-Xms${this._config.startup.xms ?? this.getMemSizeMiB(0, 2048)}M`,
        `-jar`, jar];
        if(process.platform!='win32'||this._config.startup.nogui)startup.push('nogui');
        verbose(`mc_java: starting minecraft server at ${jar}\njre nargs: ${startup.join(' ')}\nplatform: ${process.platform}\napp id: ${this.app.app_id}`);
        await event('quasr_app_starting', this.app.app_id, `starting ${jar}\njre nargs: ${startup.join(' ')}\nplatform: ${process.platform}\napp id: ${this.app.app_id}`);
        let currentRunner = await runner.create({path:process.platform=='win32' ? 'C:\\program files\\eclipse adoptium\\jre-19.0.0.36-hotspot\\bin\\java.exe' : 'sh', 
        args: process.platform=='win32' ? startup : ['-c','java '+startup.join(' ')],
        cwd: this._config.dir as string,
        size: {cols: 100, rows: 100}}, `app__${this.app.app_id}`, 
        ['application', 'mcjava', this.app.app_id]);
        let attached = await currentRunner.attach();
        let startedSucessfully:boolean = false;
        let result = await new Promise(((resolve: (value: unknown) => void, reject: (reason?: any) => void)=>{
            if (!startup.includes('nogui')) {
                //verbose(`mc_java: args are without nogui, consider server as already started`); attached.detach(); 
                //resolve(true);
            }
            let dataHandled = "";
            attached.onOutput(async o=>{
                dataHandled+=o;
                if (dataHandled.includes(`For help, `)) {
                    verbose(`mc_java: server finished loading`);
                    await event('quasr_app_startedok', this.app.app_id);
                    startedSucessfully = true; attached.detach(); resolve(true);
                }
            });
            attached.onKilled(async o=>{
                verbose(`mc_java: server killed`);
                if (!startedSucessfully) {
                    verbose(`mc_java: crashed?`);
                    attached.detach(); 
                    await event('quasr_app_startup_crashed', this.app.app_id,`looks like server crashed (exited before fully starting up) \n${dataHandled.replaceAll("\n","<br>").replace(
                        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replaceAll('<br>',"\n")}`);
                    resolve(new Error(`looks like server crashed (exited before fully starting up) \n${dataHandled.replaceAll("\n","<br>").replace(
                        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').replaceAll('<br>',"\n")}`));
                }
            });
            
        })) ;
        if (result === true) return true;
        else throw result;
    }
    public async stop(): Promise<any> {
        await event('quasr_app_stopped', this.app.app_id);
        let process = await runner.find(`app__${this.app.app_id}`);
        if (!process || !(await process.alive())) throw Error(`application is not running`);

        process.push(`\r/stop\r`);
        let alreadyExited = false;
        let forceKilled = false;
        let timeout = setTimeout(async ()=>{
            if (!alreadyExited) {
                verbose(`mc_java: server didn't stop in 7s, force killing it`);
                await event('quasr_app_forcekilled', this.app.app_id);
                process.kill();
                forceKilled=true;
            }
        }, 7500);
        return await new Promise((resolve,reject)=>{
            setTimeout(()=>{
                if (forceKilled) resolve(0);
                
            }, 8000)
            process.onKilled(async exitCode=>{
                if (forceKilled) return;
                await event('quasr_app_killed', this.app.app_id);
                verbose(`mc_java: onkilled reached`)
                alreadyExited = true; clearTimeout(timeout); resolve(exitCode)
            })
        });

    }
    async restart(): Promise<any> {
        await this.stop();
        await this.start();
    }
    public async state():Promise<state[]> {
        let process = await runner.find(`app__${this.app.app_id}`);
        let serverRunning = process && (await process.alive());
        if (!serverRunning) return [];

        //verbose(`app_mcjava: get server state`);
        let serverPropPath = path.resolve(this._config.dir as string, 'server.properties');
        let serverProps:any = {};
        if (!existsSync(serverPropPath)) {
            verbose(`app_mcjava: server_properties file doesn't exist!!! (${serverPropPath})`);
            await writeFile(serverPropPath, '');serverProps={}
        }
        else serverProps = server_properties.parse((await readFile(serverPropPath)).toString());

        let connectionIp = '127.0.0.1';
        let bindingIp = '0.0.0.0';
        if (serverProps['server-ip']&&serverProps.length!=0&&serverProps['server-ip']!='0.0.0.0') connectionIp = bindingIp =serverProps['server-ip'];
        let st = [];
        try{
            let status = await util.status(connectionIp, parseInt(serverProps['server-port'].toString()));
            st = [{key: 'stat.players', current: status.players.online.toString(), max: status.players.max}];
            await stats(st,this.app.app_id);
            return st;
        }catch(e){return [];}
    }
    public async status(): Promise<applicationStatus> {
        
        let serverPropPath = path.resolve(this._config.dir as string, 'server.properties');
        let serverProps:any = {};
        //verbose(`app_mcjava: get server status`);
        if (!existsSync(serverPropPath)) {
            verbose(`app_mcjava: server_properties file doesn't exist!!! (${serverPropPath})`);
            await writeFile(serverPropPath, '');serverProps={}
        }
        else serverProps = server_properties.parse((await readFile(serverPropPath)).toString());

        let status:applicationStatus = {} as applicationStatus;
        if (serverProps.motd) status.heading = serverProps.motd;
        else status.heading = `Minecraft: Java Edition`;

        if (this._config.dir) status.dir = this._config.dir;

        let process = await runner.find(`app__${this.app.app_id}`);
        let serverRunning = process && (await process.alive());
        if (serverRunning) status.status = 'running';
        else status.status = 'stopped';

        let connectionIp = '127.0.0.1';
        let bindingIp = '0.0.0.0';
        if (serverProps['server-ip']&&serverProps.length!=0&&serverProps['server-ip']!='0.0.0.0') connectionIp = bindingIp =serverProps['server-ip'];

        let publicIp = getPublicIp(bindingIp, serverProps['server-port']);
        status.bind = {publicIp, privateIp: serverProps['server-ip']??'0.0.0.0', port: serverProps['server-port'], proto: 'udp'};

        if (serverRunning && serverProps['query.port']&&serverProps['enable-query']){
           // verbose(`app_mcjava: server is running, connecting to query (${connectionIp}:${serverProps['query.port']})`);
            try{
                let query = await util.queryFull(connectionIp, serverProps['query.port']);
                // todo: get colored motd
                if (query.motd&&query.motd.clean)status.heading = query.motd.clean;
                if (query.players){
                    status.players = {count: query.players.online, max: query.players.max,
                    players: query.players.list.map(e=>{id:e}) as any as applicationPlayer[]}
                }
                if (query.software&&query.version) status.software = `${query.software} (${query.version})`;
                if (query.plugins && query.plugins.length!=0) status.plugins = query.plugins;
                // todo: get map preview image
                if (query.map) status.map = {name: query.map};
            }
            catch(e){}
        }
        return status;
    }

    async getAttachables(): Promise<appAttachable[]> {
        let process = await runner.find(`app__${this.app.app_id}`);
        let serverRunning = process && (await process.alive());
        if (!serverRunning) return [];
        else return [{target:`running`, type:'xterm', icon:'terminal', name: 'Minecraft server'}];
    }
    async attach(target: string): Promise<appTerminal> {
        if (target != 'running') throw new Error(`${target} is not implemented`);
        let process = await runner.find(`app__${this.app.app_id}`);
        let serverRunning = process && (await process.alive());
        if (!serverRunning) throw new Error(`app is not running`);

        return await terminal(process);
    }

}