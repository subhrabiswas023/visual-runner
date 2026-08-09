import * as vscode from "vscode";

import { getNonce } from "../../utils";

export class ConsoleProvider implements vscode.WebviewViewProvider {
    public static readonly contextValue = "visual-console";

    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "dist", "compiled"),
            ],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'runCommand':
                    // TODO: Implement command execution logic
                    // For now, just echo back the command
                    this.appendToConsole(message.text);
                    break;
            }
        });
    }

    public appendToConsole(text: string) {
        this._view?.webview.postMessage({ 
            command: 'appendOutput',
            text
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        // Get the local path to the bundled Svelte app
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'dist', 'compiled', 'Console.js')
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'dist', 'compiled', 'Console.css')
        );
        const nonce = getNonce();
        
        /* html */
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Visual Console</title>
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src ${webview.cspSource} 'nonce-${nonce}';">
                <link href="${styleMainUri}" rel="stylesheet">
            </head>
            <body>
                <div id="app"></div>
                <script type="module" src="${scriptUri}" nonce="${nonce}"></script>
            </body>
            </html>`;
    }
}


