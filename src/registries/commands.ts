import { DeferredRegistry } from '@lib/vscode-contributes/src/deferredRegistry';
import { CoreRegistryFunctions } from '@lib/vscode-contributes/src/coreRegistryFunctions';
import { CommandProviders } from '../datagen/commands';
import { InputItem } from '../../archive/Inputs/InputItem';
import { FileItem } from '../../archive/Inputs/FileItem';
import { TreeItem } from '../../archive/TreeItem';
import { TreeViews } from '../../archive/registries/treeViews';

export interface CommandHandler{
    (...args: any[]): any;
}

export class Commands {
    static readonly REGISTRY = new DeferredRegistry<CommandHandler>(CoreRegistryFunctions.COMMAND);

}