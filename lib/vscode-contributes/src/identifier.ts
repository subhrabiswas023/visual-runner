export class Identifier {
    constructor(
        readonly namespace: string, readonly path: string
    ) {}

    toString(): string {
        return `${this.namespace}.${this.path}`;
    }
}