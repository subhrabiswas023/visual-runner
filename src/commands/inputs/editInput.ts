import * as vscode from 'vscode';
import { getCommandContext } from "../context";
import { InputItem } from '../../webview/views/inputsProvider';

export async function editInput(item: InputItem) {
    const { inputsProvider } = await getCommandContext();
    
    const newContent = await vscode.window.showInputBox({
        prompt: 'Edit input content',
        value: item.content
    });

    if (newContent !== undefined) {
        const index = inputsProvider['inputs'].findIndex(i => i === item);
        if (index !== -1) {
            inputsProvider.updateInput(index, item.label, newContent, item.color);
        }
    }
}