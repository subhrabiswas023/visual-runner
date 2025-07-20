import * as vscode from 'vscode';

export abstract class AbstractTreeNode extends vscode.TreeItem {
    abstract getChildren(): vscode.ProviderResult<AbstractTreeNode[]>;
}