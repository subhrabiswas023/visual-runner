import * as vscode from 'vscode';
import { WebviewViews } from './registries/webviewViews';
import { Commands } from './registries/commands';

export function activate(context: vscode.ExtensionContext) {
    WebviewViews.REGISTRY.activate(context);
    Commands.REGISTRY.activate(context);
}

export function deactivate() {
    
}
