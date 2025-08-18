import * as vscode from 'vscode';

import { EXTENSION_ID } from './constants';
import { InputsProvider } from './views/Inputs/InputsProvider';
import { InputItem } from './views/Inputs/InputItem';
import { FileItem } from './views/Inputs/FileItem';
import { TreeItem } from './views/TreeItem';


export function activate(context: vscode.ExtensionContext) {
    const inputsProvider = new InputsProvider();

    const inputsView = vscode.window.registerTreeDataProvider(`${EXTENSION_ID}.${inputsProvider.contextValue}`, inputsProvider);
    context.subscriptions.push(inputsView);

    const handlers = {
        'refresh':() => inputsProvider.refresh(),
        'deleteItem': (e: TreeItem) => e.getParent()?.removeChild(e),
        'addFile': () => inputsProvider.inputsViewItem.addFile(),
        'addInput': (e: FileItem) => e.addInput(),
        'renameInput': (e: InputItem) => e.rename(),
    };

    for (const [id, handler] of Object.entries(handlers)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(`${EXTENSION_ID}.${inputsProvider.contextValue}.${id}`, handler)
        );
    }
}

export function deactivate() {
    
}
