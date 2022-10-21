interface Module{
    id:string
    name:string
    describe: string
    by:string,
    icon:string|'🧩',

    features: string[]
    depends: string[]

    load: () => Promise<void>
    loadAfter: string[]
    start: () => Promise<void>
    startAfter: string[]
    stop: () => Promise<void>
    stopAfter: string[]
}