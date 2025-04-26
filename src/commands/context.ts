// commands/commandContext.ts
import * as vscode from 'vscode';
import { InputsProvider } from '../webview/views/inputsProvider';
import { ConsoleProvider } from '../webview/views/consoleProvider';

export type CommandContext = {
  vscodeContext: vscode.ExtensionContext;
  inputsProvider: InputsProvider;
  consoleProvider: ConsoleProvider;
};

export async function getCommandContext(): Promise<CommandContext> {
  const context = await vscode.commands.executeCommand('_extension.getContext') as vscode.ExtensionContext;
  const inputsProvider = context.globalState.get('inputsProvider') as InputsProvider;
  const consoleProvider = context.globalState.get('consoleProvider') as ConsoleProvider;

  return {
    vscodeContext: context,
    inputsProvider,
    consoleProvider,
  };
}