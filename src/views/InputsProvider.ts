import * as vscode from "vscode";
import { AbstractTreeNode } from "./types";
import { InputItem } from "./InputItem";
import { InputLineItem } from "./InputLineItem";

export class InputsProvider
    implements vscode.TreeDataProvider<AbstractTreeNode>
{
    private _onDidChangeTreeData = new vscode.EventEmitter<
        AbstractTreeNode | undefined | null | void
    >();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private inputs = new Map<string, InputItem>();
    context = 'inputs';

    getTreeItem(
        element: AbstractTreeNode
    ): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(
        element?: AbstractTreeNode | undefined
    ): vscode.ProviderResult<AbstractTreeNode[]> {
        return element?.getChildren() ?? this.getAllInputs();
    }

    getAllInputs(): InputItem[] {
        return [...this.inputs.values()];
    }

    getDefaultLabel(): string {
        const indices = this.getAllInputs()
            .map((input) => input.label?.toString().match(/^Input (\d+)$/))
            .filter((match): match is RegExpMatchArray => match !== null)
            .map((match) => parseInt(match[1]));

        const nextIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;
        return `Input ${nextIndex}`;
    }

    addInput() {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
        const newInput = new InputItem(id, this.getDefaultLabel());
        this.inputs.set(id, newInput);
        this.refresh();
    }

    deleteInput(element: InputItem) {
        this.inputs.delete(element.id);
        this.refresh();
    }

    async renameInput(element: InputItem) {
        const label = await vscode.window.showInputBox({
            prompt: "Enter new label for the input",
            value: element.label?.toString(),
        });

        if (label) {
            element.label = label;
            this.refresh();
        }
    }

    insertLine(element: InputLineItem) {
        const input = this.inputs.get(element.parentId);
        if (input) {
            input.content.splice(element.index + 1, 0, '');
            this.refresh();
        }
    }

    deleteLine(element: InputLineItem) {
        const input = this.inputs.get(element.parentId);
        if (input && input.content.length > 1) {
            input.content.splice(element.index, 1);
            this.refresh();
        } else if (input) {
            vscode.window.showErrorMessage(
                "Cannot delete the last line of an input."
            );
        }
    }
}
