import * as vscode from 'vscode';
import { ThemeManager } from '../utils/themeManager';

export class VisualRunnerPanel {
    public static currentPanel: VisualRunnerPanel | undefined;
    private static readonly viewType = 'visualRunner';
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionContext: vscode.ExtensionContext;
    private _disposables: vscode.Disposable[] = [];

    public static serializer: vscode.WebviewPanelSerializer = {
        async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: unknown) {
            VisualRunnerPanel.currentPanel = new VisualRunnerPanel(webviewPanel, undefined);
            await VisualRunnerPanel.currentPanel._update();
            return;
        }
    };

    private constructor(panel: vscode.WebviewPanel, context?: vscode.ExtensionContext) {
        this._panel = panel;
        this._extensionContext = context || (VisualRunnerPanel.currentPanel?._extensionContext as vscode.ExtensionContext);

        this._panel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionContext.extensionUri, 'dist')
            ]
        };

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(() => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            this._handleMessage.bind(this),
            null,
            this._disposables
        );
    }

    public static createOrShow(context: vscode.ExtensionContext) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (VisualRunnerPanel.currentPanel) {
            VisualRunnerPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            VisualRunnerPanel.viewType,
            'Visual Runner',
            column || vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'dist')
                ]
            }
        );

        VisualRunnerPanel.currentPanel = new VisualRunnerPanel(panel, context);
    }

    private async _update() {
        this._panel.title = this._getPanelTitle();
        this._panel.webview.html = this._getHtmlForWebview();
    }

    private _getPanelTitle(): string {
        const editor = vscode.window.activeTextEditor;
        return editor 
            ? `Visual Runner: ${editor.document.fileName.split(/[\\/]/).pop()}`
            : 'Visual Runner';
    }

    private _getHtmlForWebview(): string {
        const webview = this._panel.webview;
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionContext.extensionUri, 'dist', 'webview.js')
        );
        const nonce = this._getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
                <title>Visual Runner</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private async _handleMessage(message: any) {
        switch (message.command) {
            case 'runFile':
                await vscode.commands.executeCommand('visual-runner.runFile');
                break;
            case 'suspendExecution':
                await vscode.commands.executeCommand('visual-runner.suspendExecution');
                break;
            case 'stopExecution':
                await vscode.commands.executeCommand('visual-runner.stopExecution');
                break;
            case 'showInputBox':
                const result = await vscode.window.showInputBox(message.value);
                this._panel.webview.postMessage({ 
                    type: 'inputBoxResult',
                    id: message.value.id,
                    value: result
                });
                break;
        }
    }

    private _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public dispose() {
        VisualRunnerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            disposable?.dispose();
        }
    }
}