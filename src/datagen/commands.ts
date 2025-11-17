import { Registry } from "@lib/vscode-contributes/src/registry";
import { EXTENSION_ID, EXTENSION_NAME } from "../constants";

export interface CommandMetadata {
    title: string;
    category?: string;
    icon?: string;
}

export class CommandProviders {
    static readonly REGISTRY = new Registry<CommandMetadata>(EXTENSION_ID);

    static readonly INPUTS = this.REGISTRY.createCategory("inputs");

    static readonly REFRESH = this.INPUTS.register("refresh", {
        title: "Refresh Inputs",
        category: EXTENSION_NAME,
        icon: "$(refresh)",
    });

    static readonly DELETE_ITEM = this.INPUTS.register("deleteItem", {
        title: "Delete Item",
        category: EXTENSION_NAME,
        icon: "$(trash)",
    });

    static readonly ADD_FILE = this.INPUTS.register("addFile", {
        title: "Add File",
        category: EXTENSION_NAME,
        icon: "$(add)",
    });

    static readonly ADD_INPUT = this.INPUTS.register("addInput", {
        title: "Add Input",
        category: EXTENSION_NAME,
        icon: "$(add)",
    });

    static readonly RENAME_INPUT = this.INPUTS.register("renameInput", {
        title: "Rename Input",
        category: EXTENSION_NAME,
        icon: "$(edit)",
    });

    static readonly EDIT_INPUT = this.INPUTS.register("editInput", {
        title: "Edit Input",
        category: EXTENSION_NAME,
        icon: "$(edit)",
    });
}
