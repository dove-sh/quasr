export abstract class StartableApplication{
    abstract start():Promise<any>;
    abstract stop():Promise<any>;
    abstract restart():Promise<any>;
}