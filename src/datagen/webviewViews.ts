import { Registry } from "@lib/vscode-contributes/src/registry";
import { EXTENSION_ID } from "../constants";

export interface WebviewViewProviderMetadata {
    name: string;
    type: string;
    visibility: string;
    icon: string;
}

export class WebviewViewProviders {
    static readonly REGISTRY = new Registry<WebviewViewProviderMetadata>(EXTENSION_ID);

    static readonly CONSOLE = this.REGISTRY.register("console", {
        name: "Visual Console",
        type: "webview",
        visibility: "visible",
        icon: "$(terminal)",
    });
}