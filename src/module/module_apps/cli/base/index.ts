import path from "path";
import { includeCliDir } from "../../../module_cli";
import { CliCommand } from "../../../module_cli/types/cliCommand";

export async function implementDefaultCli_base():Promise<CliCommand[]>{
    return await includeCliDir(path.resolve(__dirname, 'module/module_apps/cli/base'), {});
}