import * as vscode from 'vscode';
import { TreeItem } from '../TreeItem';
import { getId } from '../../utils';
import { TreeRefreshEvent } from '../types';
import { LineItem } from './LineItem';

export class InputItem extends TreeItem {
    constructor(
        label: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded, getId(), refreshCallback);
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

    async addLine() {
        const lineLabel = await vscode.window.showInputBox({
            prompt: 'Enter label for new line',
        });
        if (lineLabel) {
            const lineItem = new LineItem(lineLabel, this.refreshCallback);
            this.addChild(lineItem);
        }
    }
}