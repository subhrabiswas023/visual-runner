import * as vscode from 'vscode';
import { ProcessManager } from '../execution/processManager';
import { InputsProvider } from '../webview/views/inputsProvider';
import { ConsoleProvider } from '../webview/views/consoleProvider';

export async function runFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        // vscode.window.showErrorMessage('No active editor found');
        return;
    }

    // Get our providers from extension context
    const context = await vscode.commands.executeCommand('_extension.getContext') as vscode.ExtensionContext;
    const inputsProvider = context.globalState.get('inputsProvider') as InputsProvider;
    const consoleProvider = context.globalState.get('consoleProvider') as ConsoleProvider;

    // Clear previous console output
    consoleProvider.clear();
    consoleProvider.addMessage(`Running ${editor.document.fileName}`, 'system');

    try {
        // Get inputs from the inputs provider
        const inputs = inputsProvider['inputs'].map(input => input.content);
        
        // Create process manager with our console provider
        const processManager = new ProcessManager({
            onOutput: (data) => consoleProvider.addMessage(data.toString(), 'output'),
            onError: (data) => consoleProvider.addMessage(data.toString(), 'error'),
            onInput: (input) => consoleProvider.addMessage(input, 'input')
        });

        // Run the file
        await processManager.runFile(editor.document.fileName, inputs);
        
        consoleProvider.addMessage('Process completed successfully', 'system');
    } catch (error) {
        if (error instanceof Error) {
            consoleProvider.addMessage(`Error: ${error.message}`, 'error');
        }
        vscode.window.showErrorMessage('Failed to run file');
    }
}