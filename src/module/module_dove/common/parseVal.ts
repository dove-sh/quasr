import { availablePortDefinition } from "../../../types/port";

export function parseVal(str:string){
    str=str.replaceAll('\r\n','').replaceAll('\n','');
    if (str=='null') return null;
    if (str=='undefined') return undefined;
    if (str=="True"||str=="true") return true;
    if (str=="False"||str=="false") return false;
    if (!isNaN(str as any as number)) return parseInt(str);
    return str;
}
export function parsePortList(val:string){
    let portsRaw = val.split('\n');
    let ports:availablePortDefinition[] = [];
    for(var port of portsRaw){
        var ipPortBinding = port.split('(')[0].replaceAll(' ','');
        var bindVals = ipPortBinding.split(':');
        var publicIpBinding = bindVals[0];
        var portBinding = bindVals[1];
        var privateIpBinding = '0.0.0.0';
        if (bindVals.length >= 3) privateIpBinding = bindVals[3];
        var description = undefined;
        if (port.includes('(')) description = port.split('(')[1].slice(0,-1);
        ports.push({publicIp:publicIpBinding, privateIp: privateIpBinding, port:parseInt(portBinding), for: description});
    }
    return ports;
}