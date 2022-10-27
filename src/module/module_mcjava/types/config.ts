import { PathLike } from "fs"

export interface minecraft_startup{
    jarPath?:'auto'|string,
    win32JavaPath:string,
    xmx?:number,
    xms?:number
    nogui?:boolean
}
export interface minecraft_config{
    startup:minecraft_startup, 
    dir: PathLike,
    forceConfigure:boolean
}