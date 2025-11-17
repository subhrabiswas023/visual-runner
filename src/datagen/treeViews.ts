import { Registry } from "@lib/vscode-contributes/src/registry";
import { EXTENSION_ID } from "../constants";

export interface TreeViewMetadata {
    name: string;
    type: string;
    visibility: string;
    icon: string;
}

export class TreeViewProviders {
    static readonly REGISTRY = new Registry<TreeViewMetadata>(EXTENSION_ID);
    
    static readonly INPUTS = this.REGISTRY.register("inputs", {
        name: "Inputs",
        type: "tree",
        visibility: "visible",
        icon: "${list-tree}",
    });

    static readonly RUN_QUEUE = this.REGISTRY.register("run-queue", {
        name: "Run Queue",
        type: "tree",
        visibility: "visible",
        icon: "${play-circle}",
    });

    static readonly OUTPUTS = this.REGISTRY.register("outputs", {
        name: "Outputs",
        type: "tree",
        visibility: "visible",
        icon: "${list-tree}",
    });
}
