import * as vscode from 'vscode';

export class InputItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly content: string,
        public readonly color?: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('symbol-variable');
        this.tooltip = content;
        if (color) {
            this.iconPath = new vscode.ThemeIcon('symbol-variable', new vscode.ThemeColor(color));
        }
    }
}

export class InputsProvider implements vscode.TreeDataProvider<InputItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<InputItem | undefined | null | void> = new vscode.EventEmitter<InputItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<InputItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private inputs: InputItem[] = [];

    getTreeItem(element: InputItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: InputItem): Thenable<InputItem[]> {
        if (element) {
            return Promise.resolve([]);
        }
        return Promise.resolve(this.inputs);
    }

    addInput(label: string, content: string = '', color?: string) {
        this.inputs.push(new InputItem(label, content, color));
        this._onDidChangeTreeData.fire();
    }

    updateInput(index: number, label: string, content: string, color?: string) {
        if (index >= 0 && index < this.inputs.length) {
            this.inputs[index] = new InputItem(label, content, color);
            this._onDidChangeTreeData.fire();
        }
    }

    removeInput(index: number) {
        if (index >= 0 && index < this.inputs.length) {
            this.inputs.splice(index, 1);
            this._onDidChangeTreeData.fire();
        }
    }

    getInput(index: number): InputItem | undefined {
        return this.inputs[index];
    }
}