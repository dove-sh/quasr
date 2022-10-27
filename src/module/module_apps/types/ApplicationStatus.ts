
export interface applicationStatus{
    heading:string,
    status:'running'|'stopped'|string,
    players?:applicationPlayersList,
    bind?:applicationListening,
    [key:string]:any
} 
export interface applicationListening{
    publicIp:string,
    privateIp:string,
    port:number,
    proto:'tcp'|'udp'
}
export interface applicationPlayersList{
    count:number,
    max?:number,
    players?:applicationPlayer[],
    [key:string]:any,
}
export interface applicationPlayer{
    id:string,
    name?:string,
    ip?:string,
    [key:string]:any
}