import * as vscode from "vscode";
import { CoreRegistryFunction } from "./coreRegistryFunctions";
import { Identifier } from "./identifier";
import { DeferredRegistryRef } from "./deferredRegistryRef";
import { BaseRegistry } from "./baseRegistry";

export class DeferredRegistry<T> extends BaseRegistry<DeferredRegistryRef<T>> {
    constructor(
        readonly coreRegistryFunction: CoreRegistryFunction<T>,
        readonly namespace: string = "",
    ) {
        super(namespace);
    }

    protected instantiateCategory(
        newNamespace: Identifier
    ): this {
        return new DeferredRegistry<T>(
            this.coreRegistryFunction,
            newNamespace.toString(),
        ) as unknown as this;
    }

    register<_T extends T>(
        name: string,
        factory: (context: vscode.ExtensionContext) => _T,
        replace?: boolean
    ): DeferredRegistryRef<_T> {
        const id = new Identifier(this.namespace, name);
        const ref = new DeferredRegistryRef<_T>(id.toString(), factory);
        return this.registerValue(id, ref, replace);
    }

    activate(context: vscode.ExtensionContext) {
        for (const ref of this.getAllValues()) {
            const value = ref.create(context);
            context.subscriptions.push(
                this.coreRegistryFunction(ref.id, value)
            );
        }
    }
}
