import * as vscode from 'vscode';
import { InputsProvider } from '../webview/views/inputsProvider';

export async function addInput() {
    const context = await vscode.commands.executeCommand('_extension.getContext') as vscode.ExtensionContext;
    const inputsProvider = context.globalState.get('inputsProvider') as InputsProvider;

    const inputCount = inputsProvider['inputs'].length;
    inputsProvider.addInput(`Input ${inputCount + 1}`);
}