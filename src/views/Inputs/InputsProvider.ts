import * as vscode from "vscode";
import { TreeRefreshEvent } from "../types";
import { TreeItem } from '../TreeItem';
import path from "path/win32";
import { FileItem } from "./FileItem";
import { getId } from "../../utils";
import { InputsViewItem } from "./InputsViewItem";

export class InputsProvider
    implements vscode.TreeDataProvider<TreeItem>
{
    private _onDidChangeTreeData = new vscode.EventEmitter<TreeRefreshEvent>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(element?: TreeRefreshEvent): void {
        this._onDidChangeTreeData.fire(element);
    }

    contextValue = 'inputs';
    inputsViewItem = new InputsViewItem(this.refresh.bind(this));

    getTreeItem(
        element: TreeItem
    ): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(
        element?: TreeItem | undefined
    ): vscode.ProviderResult<TreeItem[]> {
        return element?.getChildren() ?? this.inputsViewItem.getChildren();
    }

    
}
