import * as vscode from "vscode";
import { EXTENSION_ID } from "../constants";
import { InputContentProvider } from "../views/Inputs/InputContentProvider";
import { CoreRegistryFunctions } from "../../lib/vscode-contributes/src/coreRegistryFunctions";
import { DeferredRegistry } from "../../lib/vscode-contributes/src/deferredRegistry";

export class TextDocuments {
    static readonly REGISTRY = new DeferredRegistry<vscode.TextDocumentContentProvider>(EXTENSION_ID, CoreRegistryFunctions.TEXT_DOCUMENT);

    static readonly INPUT_CONTENT = this.REGISTRY.register('input-content', () => new InputContentProvider());
}