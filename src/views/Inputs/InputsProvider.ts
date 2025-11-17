import * as vscode from "vscode";
import { TreeRefreshEvent } from "../types";
import { TreeItem } from '../TreeItem';
import { InputsViewItem } from "./InputsViewItem";

export class InputsProvider
    implements vscode.TreeDataProvider<TreeItem>
{
    private _onDidChangeTreeDataEmitter = new vscode.EventEmitter<TreeRefreshEvent>();
    readonly onDidChangeTreeData = this._onDidChangeTreeDataEmitter.event;

    refresh(element?: TreeRefreshEvent): void {
        this._onDidChangeTreeDataEmitter.fire(element);
    }

    public static readonly contextValue = 'inputs';
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
