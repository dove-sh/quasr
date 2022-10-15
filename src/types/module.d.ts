interface Module{
    id:string
    name:string
    describe: string
    by:string

    features: string[]
    depends: string[]

    load: () => Promise<void>
    loadAfter: string[]
    start: () => Promise<void>
    startAfter: string[]
    stop: () => Promise<void>
    stopAfter: string[]
}