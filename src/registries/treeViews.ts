import * as vscode from "vscode";
import { InputsProvider } from "../views/Inputs/InputsProvider";
import { CoreRegistryFunctions } from "@lib/vscode-contributes/src/coreRegistryFunctions";
import { DeferredRegistry } from "@lib/vscode-contributes/src/deferredRegistry";
import { TreeViewProviders } from "../datagen/treeViews";

export class TreeViews {
    static readonly REGISTRY = new DeferredRegistry<
        vscode.TreeDataProvider<any>
    >(CoreRegistryFunctions.TREE_VIEW);

    static readonly INPUTS = this.REGISTRY.register(
        TreeViewProviders.INPUTS.id,
        () => new InputsProvider()
    );
}
