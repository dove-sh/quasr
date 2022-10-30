import { existsSync, PathLike} from "fs";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import { parse } from "yaml";

export async function parseConfigDir(dir:PathLike){
    let config:any={};
    for(var dirent of await readdir(dir, {withFileTypes: true})){
        if (dirent.isFile()){
            if (dirent.name.endsWith('.json'))
                config[
                    dirent.name
                        .replaceAll('.json',"")
                        .replaceAll('.yaml',"")
                        .replaceAll('.yml',"")] 
                = JSON.parse((await readFile(resolve(dir.toString(),dirent.name))).toString());
                if (dirent.name.endsWith('.yaml')||dirent.name.endsWith('.yml'))
                config[
                    dirent.name
                        .replaceAll('.json',"")
                        .replaceAll('.yaml',"")
                        .replaceAll('.yml',"")] 
                = parse((await readFile(resolve(dir.toString(),dirent.name))).toString());

        }
    }
    return config;
}
export async function getConfig():Promise<any>{
    if (process.platform=='win32'){
        if (existsSync(resolve(__dirname,'../config'))) return await parseConfigDir('./config');
        else return {};
    }
    else{
        if (existsSync('/etc/quasr')) return await parseConfigDir('/etc/quasr');
        else return {};
    }
}