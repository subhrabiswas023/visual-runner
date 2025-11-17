import * as vscode from 'vscode';
import { TreeItem } from '../TreeItem';
import { TreeRefreshEvent } from '../types';
import { EXTENSION_ID } from '../../constants';

export class InputItem extends TreeItem {
    constructor(
        label: string,
        refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded, refreshCallback);
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

    async edit() {
        const uri = vscode.Uri.parse(`${EXTENSION_ID}.input-content:${this.label}`);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: false });
    }
}