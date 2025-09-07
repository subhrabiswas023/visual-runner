import * as vscode from "vscode";

export class ConsoleProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "visual-console";

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
            localResourceRoots: [this._extensionUri],
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
        if (this._view) {
            this._view.webview.postMessage({ 
                command: 'appendOutput',
                text 
            });
        }
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
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <link href="${styleMainUri}" rel="stylesheet">
                <script nonce="${nonce}">
                    window.vscode = acquireVsCodeApi();
                </script>
            </head>
            <body>
                <div id="app"></div>
                <script src="${scriptUri}" nonce="${nonce}"></script>
            </body>
            </html>`;
    }
}

function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
