import { DeferredRegistry } from '@lib/vscode-contributes/src/deferredRegistry';
import { CoreRegistryFunctions } from '@lib/vscode-contributes/src/coreRegistryFunctions';
import { CommandProviders } from '../datagen/commands';
import { InputItem } from '../views/Inputs/InputItem';
import { FileItem } from '../views/Inputs/FileItem';
import { TreeItem } from '../views/TreeItem';
import { TreeViews } from './treeViews';

export interface CommandHandler{
    (...args: any[]): any;
}

export class Commands {
    static readonly REGISTRY = new DeferredRegistry<CommandHandler>(CoreRegistryFunctions.COMMAND);

    static readonly REFRESH = this.REGISTRY.register(
        CommandProviders.REFRESH.id, 
        () => () => TreeViews.INPUTS.get().refresh(),
    );

    static readonly DELETE_ITEM = this.REGISTRY.register(
        CommandProviders.DELETE_ITEM.id, 
        () => (e: TreeItem) => e.getParent()?.removeChild(e)
    );

    static readonly ADD_FILE = this.REGISTRY.register(
        CommandProviders.ADD_FILE.id, 
        () => () => TreeViews.INPUTS.get().inputsViewItem.addFile()
    );

    static readonly ADD_INPUT = this.REGISTRY.register(
        CommandProviders.ADD_INPUT.id, 
        () => (e: FileItem) => e.addInput()
    );

    static readonly RENAME_INPUT = this.REGISTRY.register(
        CommandProviders.RENAME_INPUT.id, 
        () => (e: InputItem) => e.rename()
    );

    static readonly EDIT_INPUT = this.REGISTRY.register(
        CommandProviders.EDIT_INPUT.id, 
        () => (e: InputItem) => e.edit()
    );
}