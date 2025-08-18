import * as vscode from 'vscode';
import { TreeRefreshEvent } from './types';

export class TreeItem extends vscode.TreeItem {
    private parent?: TreeItem | undefined;
    protected _children: TreeItem[] = [];
    public readonly refreshCallback: (element?: TreeRefreshEvent) => void;

    constructor(
        label: string | vscode.TreeItemLabel,
        collapsibleState: vscode.TreeItemCollapsibleState,
        id: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    );
    constructor(
        resourceUri: vscode.Uri,
        collapsibleState: vscode.TreeItemCollapsibleState,
        id: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    );
    constructor(
        labelOrResourceUri: string | vscode.TreeItemLabel | vscode.Uri,
        collapsibleState: vscode.TreeItemCollapsibleState,
        id: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        if (labelOrResourceUri instanceof vscode.Uri) {
            super(labelOrResourceUri, collapsibleState);
        } else {
            super(labelOrResourceUri, collapsibleState);
        }
        this.id = id;
        this.refreshCallback = refreshCallback;
    }

    refresh(element?: TreeRefreshEvent) {
        this.refreshCallback(element || this);
    }

    getChildren(): vscode.ProviderResult<TreeItem[]> {
        return this._children;
    }

    getParent(): TreeItem | undefined {
        return this.parent;
    }

    addChild(child: TreeItem): void {
        child.parent = this;
        this._children.push(child);
        this.refresh();
    }

    removeChild(child: TreeItem): void {
        const index = this._children.indexOf(child);
        if (index > -1) {
            this._children.splice(index, 1);
            this.refresh();
        }
    }
}