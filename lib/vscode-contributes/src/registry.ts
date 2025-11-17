import { Identifier } from "./identifier";
import { RegistryRef } from "./registryRef";
import { BaseRegistry } from "./baseRegistry";

export class Registry<T> extends BaseRegistry<RegistryRef<T>> {
    constructor(
        readonly namespace: string = ""
    ) {
        super(namespace);
    }

    protected override instantiateCategory(
        newNamespace: Identifier
    ): this {
        return new Registry<T>(
            newNamespace.toString()
        ) as unknown as this;
    }

    register<_T extends T>(
        name: string,
        value: _T,
        replace = false
    ): RegistryRef<_T> {
        const id = new Identifier(this.namespace, name);
        const ref = new RegistryRef<_T>(id.toString(), value);
        return this.registerValue(id, ref, replace);
    }
}
