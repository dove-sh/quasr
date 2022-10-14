import { existsSync, fstat } from "fs";
import path = require("path");

export default async function():Promise<Brand>{
    let currentBrand = config.quasr.brand ?? 'default';
    if (
        !existsSync(path.resolve(__dirname, '../brand/'+currentBrand+'/brand.js'))
        ) currentBrand='default';
    let brand:Brand 
    = (await import(path.resolve(__dirname, '../brand/'+currentBrand+'/brand.js'))).default;
    return brand;
}