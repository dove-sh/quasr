import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import {ApplicationCliModule, ApplicationModule, ApplicationApiModule} from '../module_apps/types/ApplicationModule';
import { MinecraftJavaApp } from "./mcjava";
import { Application } from "../module_apps/types/Application";
import { implementDefaultApi_base } from "../module_apps/api/base";
import ApplicationApiContext from "../module_apps/types/ApplicationApiContext";
import { implementDefaultCli_base } from "../module_apps/cli/base";
import { implementDefaultCli_startable } from "../module_apps/cli/startable";
interface module_quasr_app_mcjava extends
Module,
ApplicationModule,
ApplicationCliModule, 
ApplicationApiModule{}

export default async()=>{return {
    id: 'app_mcjava',
    name: 'Minecraft',
    describe: 'Application provider for Minecraft: Java Edition (vanila) server', 
    by: 'feli', 
    icon: '⛏️',
    features: ['application', 'app_cli'],
    application: MinecraftJavaApp as (typeof Application),
    application_api: await implementDefaultApi_base(),
    application_cli: 
    (await implementDefaultCli_base())
    .concat(await implementDefaultCli_startable())
} as module_quasr_app_mcjava}