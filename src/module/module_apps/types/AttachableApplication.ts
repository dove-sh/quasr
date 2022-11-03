export interface appTerminal{
    input(data:string):string,
    onOutput(handler:(data:string)=>any):void,
    onKilled(handler:(exitCode:number)=>any):void,
    resize(size:appTerminalSize):void,
    buf():Promise<string>,
    detach():void
}
export interface appTerminalSize{
    cols:number,rows:number
}
export interface appAttachable{
    target: string,
    name?:string,
    icon?:string,
    type:'logviewer'|'xterm'|string,
    line?:string
}
export abstract class AttachableApplication{
    abstract getAttachables():Promise<appAttachable[]>
    abstract attach(target: string):Promise<appTerminal>
}