import * as vscode from 'vscode';
import { commands } from './commands';
import { InputsProvider } from './webview/views/inputsProvider';
import { ConsoleProvider } from './webview/views/consoleProvider';

const extensionId = 'visual-runner';

export function activate(context: vscode.ExtensionContext) {
    // Create providers
    const inputsProvider = new InputsProvider();
    const consoleProvider = new ConsoleProvider();

    // Register providers as global variables for command access 
    context.globalState.update('inputsProvider', inputsProvider);
    context.globalState.update('consoleProvider', consoleProvider);

    // Register views
    const inputsView = vscode.window.createTreeView(`${extensionId}-inputs`, {
        treeDataProvider: inputsProvider,
        showCollapseAll: true
    });
    const consoleView = vscode.window.createTreeView(`${extensionId}-console`, {
        treeDataProvider: consoleProvider,
        showCollapseAll: true
    });

    // Add views to subscriptions for cleanup
    context.subscriptions.push(inputsView, consoleView);

    // Register all commands from the registry
    Object.entries(commands).forEach(([id, handler]) => {
        const disposable = vscode.commands.registerCommand(id, handler);
        context.subscriptions.push(disposable);
    });

    // Watch for active editor changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            // Update view titles or state as needed
        })
    );

    // Set up file system watchers
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        const inputWatcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(workspaceFolder, '.vscode/.runner/inputs/*.json')
        );

        const cacheWatcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(workspaceFolder, '.vscode/.runner/.cache/*.{cache,output}')
        );

        inputWatcher.onDidDelete(uri => {
            // Notify input views to refresh if their storage was deleted
            const inputsProvider = context.globalState.get('inputsProvider') as InputsProvider;
            if (inputsProvider) {
                inputsProvider['inputs'] = [];
                inputsProvider['_onDidChangeTreeData'].fire();
            }
        });

        context.subscriptions.push(inputWatcher, cacheWatcher);
    }
}

export function deactivate() {
    // Clean up resources
    const context = vscode.extensions.getExtension('visual-runner')?.exports?.context;
    if (context) {
        try {
            // Clean up temporary files in .cache directory
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                const cacheUri = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode/.runner/.cache');
                vscode.workspace.fs.delete(cacheUri, { recursive: true }).catch(() => {
                    // Ignore errors during cleanup
                });
            }
        } catch (error) {
            // Log but don't throw during deactivation
            console.warn('Error during extension cleanup:', error);
        }
    }
}
