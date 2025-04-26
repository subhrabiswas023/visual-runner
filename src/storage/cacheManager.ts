import * as vscode from 'vscode';
import * as path from 'path';
import * as crypto from 'crypto';

interface CacheEntry {
    filePath: string;
    hash: string;
    timestamp: number;
    outputPath?: string;
}

export class CacheManager {
    private static readonly CACHE_LIFETIME = 3600000; // 1 hour in milliseconds
    private cacheDir: string;
    private cacheEntries: Map<string, CacheEntry>;
    private initialized: boolean = false;

    constructor(storageDir: string) {
        this.cacheDir = path.join(storageDir, '.cache');
        this.cacheEntries = new Map();
    }

    private async ensureCacheDirectory(): Promise<void> {
        if (this.initialized) {
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const cacheUri = vscode.Uri.joinPath(workspaceFolder.uri, this.cacheDir);

        try {
            await vscode.workspace.fs.createDirectory(cacheUri);
            
            // Load existing cache entries
            const entries = await vscode.workspace.fs.readDirectory(cacheUri);
            for (const [name] of entries) {
                if (name.endsWith('.cache')) {
                    const entryUri = vscode.Uri.joinPath(cacheUri, name);
                    try {
                        const content = await vscode.workspace.fs.readFile(entryUri);
                        const entry = JSON.parse(content.toString()) as CacheEntry;
                        if (this.isEntryValid(entry)) {
                            this.cacheEntries.set(entry.filePath, entry);
                        }
                    } catch (error) {
                        console.warn(`Failed to load cache entry ${name}: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            }

            // Start cleanup scheduler
            setInterval(() => this.cleanupCache(), CacheManager.CACHE_LIFETIME);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code !== 'FileExists') {
                throw new Error(`Failed to create cache directory: ${error.message}`);
            }
        }

        this.initialized = true;
    }

    async initialize(): Promise<void> {
        await this.ensureCacheDirectory();
    }

    async getCachedOutput(filePath: string): Promise<string | undefined> {
        await this.ensureCacheDirectory();

        const entry = this.cacheEntries.get(filePath);
        if (!entry || !this.isEntryValid(entry) || !entry.outputPath) {
            return undefined;
        }

        try {
            const currentHash = await this.calculateHash(filePath);
            if (currentHash !== entry.hash) {
                return undefined;
            }

            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return undefined;
            }

            const outputUri = vscode.Uri.joinPath(workspaceFolder.uri, entry.outputPath);
            const content = await vscode.workspace.fs.readFile(outputUri);
            return content.toString();
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileNotFound') {
                this.cacheEntries.delete(filePath);
            }
            return undefined;
        }
    }

    async cacheOutput(filePath: string, output: string): Promise<void> {
        await this.ensureCacheDirectory();

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        try {
            const hash = await this.calculateHash(filePath);
            const sanitizedName = path.basename(filePath).replace(/[^a-zA-Z0-9-_.]/g, '_');
            const outputPath = path.join(this.cacheDir, `${sanitizedName}.output`);
            const outputUri = vscode.Uri.joinPath(workspaceFolder.uri, outputPath);

            // Save output
            await vscode.workspace.fs.writeFile(outputUri, Buffer.from(output, 'utf-8'));

            // Create cache entry
            const entry: CacheEntry = {
                filePath,
                hash,
                timestamp: Date.now(),
                outputPath
            };

            // Save cache entry
            const entryPath = path.join(this.cacheDir, `${sanitizedName}.cache`);
            const entryUri = vscode.Uri.joinPath(workspaceFolder.uri, entryPath);
            await vscode.workspace.fs.writeFile(
                entryUri,
                Buffer.from(JSON.stringify(entry, null, 2), 'utf-8')
            );

            this.cacheEntries.set(filePath, entry);
        } catch (error) {
            throw new Error(`Failed to cache output: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async calculateHash(filePath: string): Promise<string> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        try {
            const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, filePath);
            const content = await vscode.workspace.fs.readFile(fileUri);
            return crypto.createHash('sha256').update(content).digest('hex');
        } catch (error) {
            throw new Error(`Failed to calculate hash: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async cleanupCache(): Promise<void> {
        if (!this.initialized) {
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return;
        }

        const now = Date.now();
        const entriesToRemove: string[] = [];

        for (const [filePath, entry] of this.cacheEntries) {
            if (now - entry.timestamp > CacheManager.CACHE_LIFETIME) {
                entriesToRemove.push(filePath);

                try {
                    // Remove output file
                    if (entry.outputPath) {
                        const outputUri = vscode.Uri.joinPath(workspaceFolder.uri, entry.outputPath);
                        await vscode.workspace.fs.delete(outputUri);
                    }

                    // Remove cache entry file
                    const sanitizedName = path.basename(filePath).replace(/[^a-zA-Z0-9-_.]/g, '_');
                    const entryPath = path.join(this.cacheDir, `${sanitizedName}.cache`);
                    const entryUri = vscode.Uri.joinPath(workspaceFolder.uri, entryPath);
                    await vscode.workspace.fs.delete(entryUri);
                } catch (error) {
                    if (!(error instanceof vscode.FileSystemError && error.code === 'FileNotFound')) {
                        console.warn(`Failed to cleanup cache for ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            }
        }

        // Update cache entries map
        entriesToRemove.forEach(filePath => this.cacheEntries.delete(filePath));
    }

    private isEntryValid(entry: CacheEntry): boolean {
        if (!entry || typeof entry !== 'object') {
            return false;
        }

        return (
            typeof entry.filePath === 'string' &&
            typeof entry.hash === 'string' &&
            typeof entry.timestamp === 'number' &&
            (!entry.outputPath || typeof entry.outputPath === 'string') &&
            Date.now() - entry.timestamp <= CacheManager.CACHE_LIFETIME
        );
    }
}