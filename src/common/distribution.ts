import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import * as os from 'os';
export interface distroInfo{
    name: string,
    version: string,
    id: string,
    id_like?:string,
    pretty_name?:string,
    version_id?:string,
    home_url?:string,
    support_url?:string,
    bug_report_url?:string,
    privacy_policy_url?:string,
    version_codename?: string,
    [key:string]:any
}
export async function getDistroInfo(){
const releaseDetails:distroInfo = {} as distroInfo;
if (process.platform != 'linux'){
    releaseDetails.version = os.release();
    releaseDetails.name = os.platform();
    releaseDetails.id = os.platform();
} 
if (existsSync('/etc/os-release')){
    let data = await readFile('/etc/os-release', 'utf8');
    const lines = data.split('\n')
        
    lines.forEach((line, index) => {
        const words = line.split('=')
        if (words.length!=2)return;
        releaseDetails[words[0].trim().toLowerCase()] = words[1].trim()
    });
}

  return releaseDetails;
}