interface Context{
    brand:Brand,
    version: string,
    modules: {[key: string]: Module}
}