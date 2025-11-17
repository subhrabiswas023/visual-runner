import * as vscode from 'vscode';

export class DeferredRegistryRef<T> {
    private instance?: T;

    constructor (
        public readonly id: string,
        private readonly factory: (context: vscode.ExtensionContext) => T,
    ) {}

    create(context: vscode.ExtensionContext): T {
        if (!this.instance) {
            this.instance = this.factory(context);
        }
        return this.instance;
    }

    get (): T {
        if (!this.instance) {
            throw new Error(`RegistryRef ${this.id} has not been created yet.`);
        }
        return this.instance;
    }
}