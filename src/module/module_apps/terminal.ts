import { ranProcess } from "../../types/runner";
import { appTerminal } from "./types/AttachableApplication";

export async function terminal(process:ranProcess):Promise<appTerminal>{
    let attach = await process.attach();
    return {
        input: (data) => attach.input(data), 
        onOutput(handler) {
            attach.onOutput(handler)
        },
        onKilled(handler) {
            attach.onKilled(handler)
        }, 
        resize(size) {
            attach.resize(size);
            
        },
        buf(){
            return process.getTerminalBuffer()
        },
        detach() {
            attach.detach();
        }
    }
}