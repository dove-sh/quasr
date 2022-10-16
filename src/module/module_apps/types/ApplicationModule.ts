import { ApiEndpoint } from "../../module_api/types/apiModule";
import { CliCommand } from "../../module_cli/types/cliCommand";
import { Application } from "./Application";
import { IAppEntry } from "./IAppEntry";

export interface ApplicationModule{
    application: new (entry:IAppEntry)=> Application
}
export interface ApplicationCliModule{
    application_cli: CliCommand[]
}
export interface ApplicationApiModule{
    application_api: ApiEndpoint[]
}