import { PathLike } from "fs"

export interface minecraft_startup{
    jarPath?:'auto'|string,
    xmx?:number,
    xms?:number
}
export interface minecraft_config{
    startup:minecraft_startup, 
    dir: PathLike,
    forceConfigure:boolean
}