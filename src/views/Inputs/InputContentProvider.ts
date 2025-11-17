import * as vscode from 'vscode';

export class InputContentProvider implements vscode.TextDocumentContentProvider {
    public static readonly contextValue = 'input-content';

    private _onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange = this._onDidChangeEmitter.event;
    
    private _documents = new Map<string, string>();

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this._documents.get(uri.toString()) || '';
    }

    public update(uri: vscode.Uri, content: string) {
        this._documents.set(uri.toString(), content);
        this._onDidChangeEmitter.fire(uri);
    }
}