import * as vscode from 'vscode';
import { TreeViews } from './registries/treeViews';
import { WebviewViews } from './registries/webviewViews';
import { TextDocuments } from './registries/textDocuments';
import { Commands } from './registries/commands';

export function activate(context: vscode.ExtensionContext) {
    TreeViews.REGISTRY.activate(context);
    WebviewViews.REGISTRY.activate(context);
    TextDocuments.REGISTRY.activate(context);
    
    Commands.REGISTRY.activate(context);
}

export function deactivate() {
    
}
