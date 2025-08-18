import * as vscode from 'vscode';
import { TreeItem } from './TreeItem';

export abstract class AbstractTreeNode extends vscode.TreeItem {
    abstract getChildren(): vscode.ProviderResult<AbstractTreeNode[]>;
}

export type TreeRefreshEvent = void | TreeItem | TreeItem[] | null | undefined;