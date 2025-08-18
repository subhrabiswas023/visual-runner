import * as vscode from 'vscode';
import { TreeItem } from '../TreeItem';
import { getId } from '../../utils';
import { TreeRefreshEvent } from '../types';

export class InputItem extends TreeItem {
    constructor(
        label: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super(label, vscode.TreeItemCollapsibleState.None, getId(), refreshCallback);
        this.contextValue = 'input';
    }

    async rename() {
        const newLabel = await vscode.window.showInputBox({
            prompt: 'Enter new label for input',
        });
        if (newLabel) {
            this.label = newLabel;
            this.refresh();
        }
    }
}