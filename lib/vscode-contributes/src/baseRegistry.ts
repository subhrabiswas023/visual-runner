import { Identifier } from "./identifier.js";

export class BaseRegistry<T> {
    private map = new Map<string, T>();
    private subcategories = new Array<this>();
    parent?: this;

    constructor(
        readonly namespace: string = ""
    ) {}

    createCategory(categoryName: string): this {
        const newNamespace = new Identifier(this.namespace, categoryName);
        const subCategory = this.instantiateCategory(newNamespace);
        this.subcategories.push(subCategory);
        return subCategory;
    }

    protected instantiateCategory(
        newNamespace: Identifier
    ): this {
        return new BaseRegistry<T>(
            newNamespace.toString()
        ) as unknown as this;
    }

    registerValue<_T extends T>(
        id: Identifier,
        value: _T,
        replace = false
    ): _T {
        if (!replace && this.map.has(id.toString())) {
            throw new Error(`Duplicate id: ${id.toString()}`);
        }
        
        this.map.set(id.toString(), value as unknown as T);
        return value;
    }

    getAllValues(): T[] {
        let values = Array.from(this.map.values());
        for (const subcategory of this.subcategories) {
            values = values.concat(subcategory.getAllValues());
        }
        return values;
    }
}