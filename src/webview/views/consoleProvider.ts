import * as vscode from 'vscode';

export class ConsoleItem extends vscode.TreeItem {
    constructor(
        public readonly content: string,
        public readonly type: 'output' | 'error' | 'input' | 'system',
        public readonly timestamp: number
    ) {
        super(content, vscode.TreeItemCollapsibleState.None);
        
        switch (type) {
            case 'error':
                this.iconPath = new vscode.ThemeIcon('error');
                break;
            case 'input':
                this.iconPath = new vscode.ThemeIcon('arrow-right');
                break;
            case 'system':
                this.iconPath = new vscode.ThemeIcon('info');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('terminal');
        }

        this.tooltip = new Date(timestamp).toLocaleTimeString();
        this.description = this.tooltip;
    }
}

export class ConsoleProvider implements vscode.TreeDataProvider<ConsoleItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ConsoleItem | undefined | null | void> = new vscode.EventEmitter<ConsoleItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ConsoleItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private messages: ConsoleItem[] = [];

    getTreeItem(element: ConsoleItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ConsoleItem): Thenable<ConsoleItem[]> {
        if (element) {
            return Promise.resolve([]);
        }
        return Promise.resolve(this.messages);
    }

    addMessage(content: string, type: 'output' | 'error' | 'input' | 'system' = 'output') {
        this.messages.push(new ConsoleItem(content, type, Date.now()));
        this._onDidChangeTreeData.fire();
    }

    clear() {
        this.messages = [];
        this._onDidChangeTreeData.fire();
    }
}