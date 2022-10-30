import { existsSync} from "fs";
import { readFile, readdir  } from "fs/promises";
import { availablePortDefinition } from "../../types/port";
import { parsePortList, parseVal } from "./common/parseVal";
import c from '../../common/cli_colors';
import applyBrand from '../../base/brand';
import { model, Schema } from "mongoose";
export interface doveEnvironment{
    apiDomain?:string,
    isContainer:boolean,
    ports:availablePortDefinition[],
    privateIp:string,
    serverUid:string,
    brand:string,
    [key:string]:any
}
export async function getDoveEnv():Promise<doveEnvironment>{
    let getVal = async (path:string)=>{
		return path.split('/').at(-1)=='ports'?parsePortList((await readFile(path)).toString()) :
		parseVal((await readFile(path)).toString());}

	let config:doveEnvironment = {
		apiDomain: undefined,
		isContainer: false,
		ports: [],
		privateIp: undefined,
		serverUid: undefined,
		brand: 'default'
	};
	if (!existsSync('/etc/dove/config')){
		console.log(
	
`${c.yellow}dove_env: ${c.reset} entire directory ${c.bright}/etc/dove/config${c.reset} doesn't exists on this instance.
using default configuration, everything is messed up too much here so extremely likely that this thing won't work properly.`
		);return config;}
	let dir = await readdir('/etc/dove/config', {withFileTypes: true});
	for(var file of dir){
		if (!file.isFile()) continue;
		config[file.name] = await getVal('/etc/dove/config/'+file.name);
	}
	return config;
}
export async function module_load(){
    global.config.environment = await getDoveEnv();
    verbose(`dove_env: look at this config!`);
    verbose(global.config.environment);
    global.context.brand = await applyBrand(global.config.environment.brand);

    var schema = new Schema({ key: String, expire: Number });
    storage.dove_auth_sessions = model('Dove.auth_sessions', schema);
}