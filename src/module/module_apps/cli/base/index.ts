import { includeCliDir } from "../../../module_cli";
import { CliCommand } from "../../../module_cli/types/cliCommand";

export function implementDefaultCli_base():CliCommand[]{
    return includeCliDir(__dirname, {});
}