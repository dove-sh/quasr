import { implementDirSync } from "../../../module_api";
import { ApiEndpoint } from "../../../module_api/types/apiModule";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import state from "./state";
import status from './status';
export function implementDefault_base():ApiEndpoint[]{
    return implementDirSync(__dirname);
}