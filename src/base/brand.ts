import { existsSync, fstat } from "fs";
import * as path from "path";

export default async function():Promise<Brand>{
    let currentBrand = config.quasr.brand ?? 'default';
    if (
        !existsSync(path.resolve(__dirname, 'brand/'+currentBrand+'/brand.js'))
        ) currentBrand='default';
    let brand:Brand
    = (await import('file://'+path.resolve(__dirname, 'brand/'+currentBrand+'/brand.js'))).default;
    return brand;
}