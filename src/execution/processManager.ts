import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import { EventEmitter } from 'events';

export interface ProcessConfig {
    command: string;
    args: string[];
    cwd?: string;
    timeout?: number;
    shell?: boolean;
}

export class ProcessManager extends EventEmitter {
    private currentProcess?: childProcess.ChildProcess;
    private processConfig?: ProcessConfig;
    private disposeCallbacks: (() => void)[] = [];

    async spawnProcess(config: ProcessConfig): Promise<void> {
        // Ensure no existing process is running
        if (this.currentProcess) {
            throw new Error('Process is already running');
        }

        // Verify file existence for the first arg (which is typically the file to execute)
        if (config.args.length > 0) {
            const filePath = config.args[0];
            try {
                const uri = vscode.Uri.file(filePath);
                await vscode.workspace.fs.stat(uri);
            } catch (error) {
                if (error instanceof vscode.FileSystemError) {
                    if (error.code === 'FileNotFound') {
                        throw new Error(`File not found: ${filePath}`);
                    } else {
                        throw new Error(`Cannot access file ${filePath}: ${error.message}`);
                    }
                }
                throw error;
            }
        }

        this.processConfig = config;

        return new Promise((resolve, reject) => {
            try {
                this.currentProcess = childProcess.spawn(
                    config.command,
                    config.args,
                    {
                        cwd: config.cwd,
                        shell: config.shell,
                        stdio: ['pipe', 'pipe', 'pipe']
                    }
                );

                // Set up timeout if specified
                let timeoutHandle: NodeJS.Timeout | undefined;
                if (config.timeout) {
                    timeoutHandle = setTimeout(() => {
                        this.terminateProcess();
                        reject(new Error('Process execution timed out'));
                    }, config.timeout);
                    this.disposeCallbacks.push(() => clearTimeout(timeoutHandle));
                }

                // Handle process events
                this.currentProcess.on('error', (error) => {
                    if (error.message.includes('ENOENT')) {
                        reject(new Error(`Command not found: ${config.command}`));
                    } else {
                        reject(error);
                    }
                });

                this.currentProcess.stdout?.on('data', (data) => {
                    this.emit('output', data.toString());
                });

                this.currentProcess.stderr?.on('data', (data) => {
                    this.emit('error', data.toString());
                });

                this.currentProcess.on('exit', (code, signal) => {
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    
                    this.currentProcess = undefined;
                    this.processConfig = undefined;

                    if (signal) {
                        this.emit('exit', null, signal);
                    } else {
                        this.emit('exit', code);
                    }
                });

                // Process started successfully
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async suspendProcess(): Promise<void> {
        if (!this.currentProcess) {
            throw new Error('No process is running');
        }

        if (process.platform === 'win32') {
            // Windows doesn't support SIGSTOP/SIGCONT
            throw new Error('Process suspension is not supported on Windows');
        }

        try {
            this.currentProcess.kill('SIGSTOP');
            this.emit('suspended');
        } catch (error) {
            throw new Error(`Failed to suspend process: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async resumeProcess(): Promise<void> {
        if (!this.currentProcess) {
            throw new Error('No process is running');
        }

        if (process.platform === 'win32') {
            throw new Error('Process resumption is not supported on Windows');
        }

        try {
            this.currentProcess.kill('SIGCONT');
            this.emit('resumed');
        } catch (error) {
            throw new Error(`Failed to resume process: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async terminateProcess(): Promise<void> {
        if (!this.currentProcess) {
            return;
        }

        try {
            // Try graceful termination first
            this.currentProcess.kill('SIGTERM');

            // Force kill after timeout
            const forceKillTimeout = setTimeout(() => {
                if (this.currentProcess) {
                    this.currentProcess.kill('SIGKILL');
                }
            }, 5000);

            this.disposeCallbacks.push(() => clearTimeout(forceKillTimeout));
        } catch (error) {
            throw new Error(`Failed to terminate process: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            this.currentProcess = undefined;
            this.processConfig = undefined;
        }
    }

    isProcessRunning(): boolean {
        return this.currentProcess !== undefined && !this.currentProcess.killed;
    }

    onProcessOutput(callback: (data: string) => void): void {
        this.on('output', callback);
    }

    onProcessError(callback: (error: Error | string) => void): void {
        this.on('error', callback);
    }

    onProcessExit(callback: (code: number | null, signal?: string) => void): void {
        this.on('exit', callback);
    }

    dispose(): void {
        this.terminateProcess();
        this.disposeCallbacks.forEach(cb => cb());
        this.disposeCallbacks = [];
        this.removeAllListeners();
    }
}