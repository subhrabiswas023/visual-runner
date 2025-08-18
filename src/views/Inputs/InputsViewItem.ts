import * as vscode from 'vscode';
import { TreeItem } from '../TreeItem';
import { TreeRefreshEvent } from '../types';
import { getId } from '../../utils';
import path from 'path';
import { FileItem } from './FileItem';

export class InputsViewItem extends TreeItem {
    constructor (
        refreshCallback: (element?: TreeRefreshEvent) => void
    ) {
        super('Inputs View', vscode.TreeItemCollapsibleState.Collapsed, getId(), refreshCallback);
    }

    refresh(element?: TreeRefreshEvent): void {
        this.refreshCallback();
    }

    async addFile() {
        // Get files from the workspace
        const files = await vscode.workspace.findFiles('**/*', '{**/.git/**,**/node_modules/**,**/.vscode/**}');
        // Prepare quickpick items
        const quickPickItems: (vscode.QuickPickItem & { resourceUri: vscode.Uri })[] = files.map(file => {
            return {
                label: path.basename(file.fsPath),
                description: vscode.workspace.asRelativePath(file),
                iconPath: vscode.ThemeIcon.File,
                resourceUri: file
            };
        });
        // Quick pick files from the workspace
        const selectedFile = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: 'Select a file or press Escape to cancel',
            matchOnDescription: true,
        });

        if (selectedFile) {
            // Create a new FileItem for the selected file
            const fileItem = new FileItem(selectedFile.resourceUri, this.refreshCallback);
            this.addChild(fileItem);
        }
    }
}