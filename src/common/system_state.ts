import osutils from 'node-os-utils';
import { stat } from '../base/mongo/stats';
import { state } from '../types/state';
export async function system_state():Promise<state[]> {
    let info:state[] = [];
    osutils.options.INTERVAL=1000;
    
    if (osutils.mem){
        let memory = await osutils.mem.info();
        await stat({
            "key":"system.memory",
            "unit":"MiB",
            "current":Math.floor(memory.usedMemMb),
            "max":Math.floor(memory.totalMemMb)
        }, 'system');
        info.push({
            "key":"system.memory",
            "unit":"MiB",
            "current":Math.floor(memory.usedMemMb),
            "max":Math.floor(memory.totalMemMb)
        });
    }
    if (osutils.cpu){
        let cpuUsage = await osutils.cpu.usage();
        let cpuCount = await osutils.cpu.count(); 
        await stat({
            "key":"system.cpu",
            "desc":`${cpuCount} CPUs`,
            "current":`${cpuUsage}%`
        }, 'system');
        info.push({
            "key":"system.cpu",
            "desc":`${cpuCount} CPUs`,
            "current":`${cpuUsage}%`
        });
    }

    return info;
}