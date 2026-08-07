import * as vscode from 'vscode';
import { ConsoleProvider } from '../views/console/ConsoleProvider';
import { CoreRegistryFunctions } from '@lib/vscode-contributes/src/coreRegistryFunctions';
import { DeferredRegistry } from '@lib/vscode-contributes/src/deferredRegistry';
import { WebviewViewProviders } from '../datagen/webviewViews';

export class WebviewViews {    
    static readonly REGISTRY = new DeferredRegistry<vscode.WebviewViewProvider>(CoreRegistryFunctions.WEBVIEW_VIEW);

    static readonly CONSOLE = this.REGISTRY.register(WebviewViewProviders.CONSOLE.id, context => new ConsoleProvider(context.extensionUri));
}