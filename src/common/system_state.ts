import osutils from 'node-os-utils';
import { state } from '../types/state';
export async function system_state():Promise<state[]> {
    let info:state[] = [];
    osutils.options.INTERVAL=1000;
    
    if (osutils.mem){
        let memory = await osutils.mem.info();
        info.push({
            "key":"stat.memory",
            "unit":"MiB",
            "current":Math.floor(memory.usedMemMb),
            "max":Math.floor(memory.totalMemMb)
        });
    }
    if (osutils.cpu){
        let cpuUsage = await osutils.cpu.usage();
        let cpuCount = await osutils.cpu.count(); 
    
        info.push({
            "key":"stat.cpu",
            "desc":`${cpuCount} CPUs`,
            "current":`${cpuUsage}%`
        });
    }

    return info;
}