import { Registry } from "@lib/vscode-contributes/src/registry";
import { EXTENSION_ID, EXTENSION_NAME } from "../constants";

export interface CommandMetadata {
    title: string;
    category?: string;
    icon?: string;
}

export class CommandProviders {
    static readonly REGISTRY = new Registry<CommandMetadata>(EXTENSION_ID);

}
