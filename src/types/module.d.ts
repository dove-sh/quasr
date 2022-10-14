interface Module{
    id:string
    name:string
    describe: string
    by:string

    features: string[]
    depends: string[]

    init: () => Promise<void>
    initAfter: string[]
    start: () => Promise<void>
    startAfter: string[]
}