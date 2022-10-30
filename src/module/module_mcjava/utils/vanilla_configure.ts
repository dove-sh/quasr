import { existsSync, fstat, write } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { UsedPort } from "../../../base/mongo/usedPorts";
import { getPort, getUsedPorts, usePort } from "../../../common/search_port";
import { availablePortDefinition } from "../../../types/port";
import { minecraft_config, minecraft_startup } from "../types/config";
import * as server_properties from './server_properties';

export default async function(config:minecraft_config, app_id:string):Promise<minecraft_config>{
    if (!config.startup) config.startup = {} as minecraft_startup;
    if (!config.startup.jarPath) config.startup.jarPath = 'auto';
    
    let serverPropPath = path.resolve(config.dir as string, 'server.properties');
    let serverProps:any = {};
    if (!existsSync(serverPropPath)) {await writeFile(serverPropPath, '');serverProps={}}
    else serverProps = server_properties.parse((await readFile(serverPropPath)).toString());

    if (config.forceConfigure){
        serverProps["server-ip"] = null;
        serverProps["query.port"] = 0;
        serverProps["rcon.port"] = 0;
        serverProps["server-port"] = 0;
    }
    let mainPort:availablePortDefinition;
    let secondPort:availablePortDefinition;

    let currentUsedPorts = (await getUsedPorts()).filter(u=>u.usedBy.module=='module_mcjava'&&u.usedBy.app==app_id);
    if (currentUsedPorts.length==0){
        mainPort = await getPort('app',false,12400,28000);
        if (!mainPort) throw Error("couldn't find port for minecraft server");
        secondPort = await getPort('app', false,25565,28000);

        usePort({ip: mainPort.privateIp, port: mainPort.port, usedBy: {module: 'module_mcjava', app:app_id}} as UsedPort)
        if (secondPort) usePort({ip: secondPort.privateIp, port: secondPort.port, usedBy: {module: 'module_mcjava', app:app_id}} as UsedPort)
    }
    else{
        mainPort = {privateIp: currentUsedPorts[0].ip, port: currentUsedPorts[0].port} as availablePortDefinition;
        if (currentUsedPorts.length>1)secondPort = {privateIp: currentUsedPorts[1].ip, port: currentUsedPorts[1].port} as availablePortDefinition;
    }

    if (!serverProps['server-ip']) serverProps['server-ip'] = mainPort.privateIp;
    if (!serverProps['server-port']) serverProps['server-port'] = mainPort.port;
    if (!serverProps['query.port']) serverProps['query.port'] = mainPort.port;
    if (!serverProps['rcon.port']&&secondPort) serverProps['rcon.port'] = secondPort.port;
    if (!Object.hasOwn(serverProps, 'enable-query')) serverProps['enable-query'] = true;
    if (!Object.hasOwn(serverProps, 'motd') && global.context.brand.default_motd)
     serverProps['motd'] = global.context.brand.default_motd;

    var eulaPath = path.resolve(config.dir as string, 'eula.txt');
    if (!existsSync(eulaPath) || !(await readFile(eulaPath)).toString().includes('eula=true'))
        await writeFile(eulaPath, '#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).\neula=true');
    await writeFile(serverPropPath, server_properties.stringify(serverProps));

    return config;
}