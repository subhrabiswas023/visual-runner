import * as vscode from 'vscode';

export interface CoreRegistryFunction<T> {
    (id: string, value: T): vscode.Disposable;
}

export class CoreRegistryFunctions {
    static readonly COMMAND = (id: string, value: (...args: any[]) => any) => {
        return vscode.commands.registerCommand(id, value);
    };

    static readonly TREE_VIEW = (id: string, value: vscode.TreeDataProvider<any>) => {
        return vscode.window.registerTreeDataProvider(id, value);
    };

    static readonly WEBVIEW_VIEW = (id: string, value: vscode.WebviewViewProvider) => {
        return vscode.window.registerWebviewViewProvider(id, value);
    };

    static readonly TEXT_DOCUMENT = (id: string, value: vscode.TextDocumentContentProvider) => {
        return vscode.workspace.registerTextDocumentContentProvider(id, value);
    };
}