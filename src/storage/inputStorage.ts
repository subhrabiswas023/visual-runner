import * as vscode from 'vscode';
import * as path from 'path';

export interface InputViewConfig {
    id: string;
    name: string;
    content: string;
    color?: string;
}

export interface FileInputState {
    filePath: string;
    views: InputViewConfig[];
    activeViewId?: string;
}

export class InputStorage {
    private static readonly STORAGE_DIR = '.vscode/.runner/inputs';
    private context: vscode.ExtensionContext;
    private initialized: boolean = false;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    private async ensureStorageDirectory(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const storageUri = vscode.Uri.joinPath(workspaceFolder.uri, InputStorage.STORAGE_DIR);

        try {
            await vscode.workspace.fs.createDirectory(storageUri);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code !== 'FileExists') {
                throw new Error(`Failed to create storage directory: ${error.message}`);
            }
        }

        this.initialized = true;
    }

    async saveInputState(state: FileInputState): Promise<void> {
        await this.ensureStorageDirectory();
        
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const filePath = this.getStoragePath(state.filePath);
        const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, filePath);

        try {
            const content = JSON.stringify(state, null, 2);
            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf-8'));
        } catch (error) {
            throw new Error(`Failed to save input state: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async loadInputState(filePath: string): Promise<FileInputState | undefined> {
        await this.ensureStorageDirectory();
        
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return undefined;
        }

        const storagePath = this.getStoragePath(filePath);
        const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, storagePath);

        try {
            const content = await vscode.workspace.fs.readFile(fileUri);
            const state = JSON.parse(content.toString()) as FileInputState;
            return this.validateState(state) ? state : undefined;
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileNotFound') {
                return undefined;
            }
            console.warn(`Failed to load input state: ${error instanceof Error ? error.message : String(error)}`);
            return undefined;
        }
    }

    async exportInputs(targetPath: string): Promise<void> {
        await this.ensureStorageDirectory();
        const state = await this.loadInputState(targetPath);
        if (!state) {
            throw new Error('No input state to export');
        }

        const exportUri = vscode.Uri.file(targetPath);
        try {
            const content = JSON.stringify(state, null, 2);
            await vscode.workspace.fs.writeFile(exportUri, Buffer.from(content, 'utf-8'));
        } catch (error) {
            throw new Error(`Failed to export inputs: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async importInputs(sourcePath: string): Promise<void> {
        const sourceUri = vscode.Uri.file(sourcePath);
        try {
            const content = await vscode.workspace.fs.readFile(sourceUri);
            const state = JSON.parse(content.toString()) as FileInputState;
            if (this.validateState(state)) {
                await this.saveInputState(state);
            } else {
                throw new Error('Invalid input state format');
            }
        } catch (error) {
            throw new Error(`Failed to import inputs: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private getStoragePath(filePath: string): string {
        const sanitizedName = path.basename(filePath).replace(/[^a-zA-Z0-9-_.]/g, '_');
        return path.join(InputStorage.STORAGE_DIR, `${sanitizedName}.inputs.json`);
    }

    private validateState(state: any): state is FileInputState {
        return (
            typeof state === 'object' &&
            typeof state.filePath === 'string' &&
            Array.isArray(state.views) &&
            state.views.every(view => 
                typeof view.id === 'string' &&
                typeof view.name === 'string' &&
                typeof view.content === 'string'
            )
        );
    }
}