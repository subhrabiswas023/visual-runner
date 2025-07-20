import * as vscode from 'vscode';
import { AbstractTreeNode } from './types';

export class InputLineItem extends AbstractTreeNode {
    constructor(
        readonly index: number,
        readonly parentId: string,
        label: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'line';
    }

    getChildren(): vscode.ProviderResult<AbstractTreeNode[]> {
        return [];
    }
}