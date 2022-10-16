import { ApiModule } from "../module_api/types/apiModule";
import { CliModule } from "../module_cli/types/cliCommand";
import {ApplicationModule} from '../module_apps/types/ApplicationModule';
import { MinecraftJavaApp } from "./mcjava";
import { Application } from "../module_apps/types/Application";
import { implementDefault_base } from "../module_apps/api/base";
interface module_quasr_app_mcjava extends Module, ApplicationModule{}

export default {
    id: 'app_mcjava',
    name: 'Minecraft',
    describe: 'Application provider for Minecraft: Java Edition (vanila) server', 
    by: 'fearfeth', 
    features: ['application'],
    application: MinecraftJavaApp as (typeof Application), 
    application_api: implementDefault_base()
} as module_quasr_app_mcjava