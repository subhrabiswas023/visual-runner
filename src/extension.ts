import * as vscode from 'vscode';

import { EXTENSION_ID } from './constants';
import { InputsProvider } from './views/Inputs/InputsProvider';
import { InputItem } from './views/Inputs/InputItem';
import { FileItem } from './views/Inputs/FileItem';
import { TreeItem } from './views/TreeItem';
import { ConsoleProvider } from './views/console/ConsoleProvider';


export function activate(context: vscode.ExtensionContext) {
    const inputsProvider = new InputsProvider();

    const inputsView = vscode.window.registerTreeDataProvider(`${EXTENSION_ID}-${inputsProvider.contextValue}`, inputsProvider);
    context.subscriptions.push(inputsView);

    const consoleProvider = new ConsoleProvider(context.extensionUri);
    const consoleView = vscode.window.registerWebviewViewProvider(ConsoleProvider.viewType, consoleProvider);
    context.subscriptions.push(consoleView);

    const handlers = {
        'inputs.deleteItem': (e: TreeItem) => e.getParent()?.removeChild(e),
        'inputs.refresh':() => inputsProvider.refresh(),
        'inputs.addFile': () => inputsProvider.inputsViewItem.addFile(),
        'inputs.addInput': (e: FileItem) => e.addInput(),
        'inputs.renameInput': (e: InputItem) => e.rename(),
        'inputs.addLine': (e: InputItem) => e.addLine(),
    };
    for (const [id, handler] of Object.entries(handlers)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(`${EXTENSION_ID}-${id}`, handler)
        );
    }
}

export function deactivate() {
    
}
