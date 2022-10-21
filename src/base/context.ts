import getBrand from './brand';
import {getModules} from './modules';
export default async function():Promise<Context>{
    return {
        brand:await getBrand(),
        version: '0.0.1', 
        modules: (await getModules())
    }
}