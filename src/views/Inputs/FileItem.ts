import * as vscode from 'vscode';
import { getId } from '../../utils';
import { TreeItem } from '../TreeItem';
import { TreeRefreshEvent } from '../types';
import { InputItem } from './InputItem';

export class FileItem extends TreeItem {
    constructor(
        resourceUri: vscode.Uri,
        public readonly refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super(resourceUri, vscode.TreeItemCollapsibleState.Expanded, getId(), refreshCallback);
        this.contextValue = 'file';
        this.iconPath = vscode.ThemeIcon.File;
    }

    // TODO: put this in {@link utils.js} file as an algorithm 
    private getDefaultLabel(): string {
        const inputItems = this._children;
        const indices = inputItems
            .map((input) => input.label?.toString().match(/^Input (\d+)$/))
            .filter((match): match is RegExpMatchArray => match !== null)
            .map((match) => parseInt(match[1]));

        const nextIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;
        return `Input ${nextIndex}`;
    }

    addInput() {
        const label = this.getDefaultLabel();
        const inputItem = new InputItem(label, this.refreshCallback);
        this.addChild(inputItem);
    }
}