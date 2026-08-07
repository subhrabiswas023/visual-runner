export class Identifier {
    constructor(
        readonly namespace: string, readonly path: string
    ) {}

    toString(): string {
        const period = this.namespace ? "." : "";
        return `${this.namespace}${period}${this.path}`;
    }
}