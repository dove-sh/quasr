import { UsedPort } from "../base/mongo/usedPorts";
import { availablePortDefinition } from "../types/port";
import _getPort, {makeRange} from 'get-port';

export async function getPort(portFor:string='any', includeUsedPorts:boolean=false, portMin?:number, portMax?:number, host?:string):Promise<availablePortDefinition>{
    var portsAvailable:availablePortDefinition[]|undefined = undefined;
    if (global.config.environment && global.config.environment.ports){
        portsAvailable = global.config.environment.ports;
        portsAvailable = portsAvailable.filter(p=>p.for==portFor);
        if (host)portsAvailable=portsAvailable.filter(p=>p.for==host);
    }
    var portsExcluded:number[] = [];
    if (!includeUsedPorts){
        var usedPorts = await getUsedPorts();
        for(var port of usedPorts){
            portsExcluded.push(port.port);
            if (portsAvailable)portsAvailable=portsAvailable.filter
            (p=>(p.privateIp!=host&&p.privateIp!='0.0.0.0')&&p.port!=port.port)
        }
    }
    let ret:availablePortDefinition;
    if (!portsAvailable){
        try{
        let gotPort = await _getPort({port:(portMax||portMin) ? makeRange(portMin??1000,portMax??65535):undefined, host: host??'0.0.0.0'});
        return {port: gotPort, privateIp: host??'0.0.0.0', publicIp:undefined} as availablePortDefinition;}catch(e){console.log(e)}
    }
    else{
        for(var portAvailable of portsAvailable){
            try{
                let gotPort = await _getPort({port:portAvailable.port, host:portAvailable.privateIp??'0.0.0.0'});
                if (gotPort) return portAvailable;
            }catch(e){console.log(e)}
        }
    }
    
    return undefined;
}
export async function getUsedPorts():Promise<UsedPort[]>{
    var ports = await storage.usedPorts.find({}).exec();
    return ports.map(port=>{
        var p =  (port as UsedPort);
        return {port: p.port, ip: p.ip, usedBy: p.usedBy}
    });
}

export async function usePort(port: UsedPort):Promise<UsedPort>{
    
    var p = new storage.usedPorts({ip: port.ip, port: port.port, usedBy: port.usedBy});
    await p.save();
    return p;
}