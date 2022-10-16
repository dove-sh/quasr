import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import {ApplicationCliModule, ApplicationModule, ApplicationApiModule} from '../module_apps/types/ApplicationModule';
import { MinecraftJavaApp } from "./mcjava";
import { Application } from "../module_apps/types/Application";
import { implementDefaultApi_base } from "../module_apps/api/base";
import ApplicationApiContext from "../module_apps/types/ApplicationApiContext";
import { implementDefaultCli_base } from "../module_apps/cli/base";
interface module_quasr_app_mcjava extends
Module,
ApplicationModule,
ApplicationCliModule, 
ApplicationApiModule{}

export default {
    id: 'app_mcjava',
    name: 'Minecraft',
    describe: 'Application provider for Minecraft: Java Edition (vanila) server', 
    by: 'fearfeth', 
    features: ['application'],
    application: MinecraftJavaApp as (typeof Application), 
    application_api: implementDefaultApi_base(),
    application_cli: implementDefaultCli_base()
} as module_quasr_app_mcjava