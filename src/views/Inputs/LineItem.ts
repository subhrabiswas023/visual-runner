import * as vscode from 'vscode';
import { TreeItem } from "../TreeItem";
import { TreeRefreshEvent } from '../types';
import { getId } from '../../utils';

export class LineItem extends TreeItem {
    constructor(
        label: string | vscode.TreeItemLabel,
        public readonly refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super(label, vscode.TreeItemCollapsibleState.None, getId(), refreshCallback);
        this.contextValue = 'line';
        this.label = label;
    }
}