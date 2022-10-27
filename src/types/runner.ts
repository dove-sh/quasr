export interface runner{
    create(options:runOptions,key:string,tags:string[]):Promise<ranProcess>
    find(key:string):Promise<ranProcess>
}
export interface runOptions{
    path:string,
    args:string[],
    cwd?:string,
    env?:{[key:string]:string},
    size:runPtySize
}
export interface runPtySize{
    cols:number,rows:number
}
export interface ranProcess{
    tags:string[],
    key:string,
    pid:number,
    alive():boolean|Promise<boolean>,
    kill():void,
    attach():Promise<attachedProcess>,
    push(data:string):any,
    onKilled(handler:(exitCode:number)=>any):void,
}
export interface attachedProcess{
    input(data:string):string,
    onOutput(handler:(data:string)=>any):void,
    onKilled(handler:(exitCode:number)=>any):void,
    resize(size:runPtySize):void,
    detach():void
}