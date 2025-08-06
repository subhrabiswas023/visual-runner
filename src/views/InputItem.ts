import * as vscode from 'vscode';
import { AbstractTreeNode } from './types';
import { InputLineItem } from './InputLineItem';

export class InputItem extends AbstractTreeNode{
    content: string[] = [''];

    constructor(
        readonly id: string,
        label: string,
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'input';
    }

    getChildren(): vscode.ProviderResult<AbstractTreeNode[]> {
        return this.content.map(
            (label, index) => new InputLineItem(index, this.id, label)
        );
    }
}