import * as vscode from 'vscode';

import { EXTENSION_ID } from './constants';
import { InputsProvider } from './views/InputsProvider';
import { InputItem } from './views/InputItem';


export function activate(context: vscode.ExtensionContext) {
    const inputsProvider = new InputsProvider();
    const inputsView = vscode.window.registerTreeDataProvider(`${EXTENSION_ID}.${inputsProvider.context}`, inputsProvider);
    context.subscriptions.push(inputsView);

    const handlers = {
        'addInput':() => inputsProvider.addInput(),
        'refresh':() => inputsProvider.refresh(),
        'deleteInput':(e: InputItem) => inputsProvider.deleteInput(e),
        'renameInput':(e: InputItem) => inputsProvider.renameInput(e),
    };

    for (const [id, handler] of Object.entries(handlers)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(`${EXTENSION_ID}.${inputsProvider.context}.${id}`, handler)
        );
    }
}

export function deactivate() {
    
}
