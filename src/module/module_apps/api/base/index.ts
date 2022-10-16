import { implementDirSync } from "../../../module_api";
import { ApiEndpoint } from "../../../module_api/types/apiModule";
import ApplicationApiContext from "../../types/ApplicationApiContext";
import state from "./state";
import status from './status';
export function implementDefaultApi_base():ApiEndpoint[]{
    return implementDirSync(__dirname);
}