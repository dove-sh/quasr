import { ApiEndpoint } from "../../module_api/types/apiModule";
import { Application } from "./Application";
import { IAppEntry } from "./IAppEntry";

export interface ApplicationModule{
    application: new (entry:IAppEntry)=> Application,
    application_api: ApiEndpoint[]
}