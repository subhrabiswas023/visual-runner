import * as vscode from 'vscode';

interface ConsoleMessage {
    type: 'output' | 'error' | 'input' | 'system';
    content: string;
    timestamp: number;
}

export class ConsoleView {
    private static readonly template = `
        <div class="monaco-workbench">
            <div class="debug-view-content">
                <div class="debug-console-container">
                    <div class="debug-console-messages"></div>
                    <div class="debug-console-input-wrapper">
                        <div class="monaco-input-box">
                            <input type="text" class="monaco-input" placeholder="Type input here..." disabled />
                            <div class="status-info"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    private static readonly styles = `
        .debug-view-content {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .debug-console-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background: var(--vscode-terminal-background);
            color: var(--vscode-terminal-foreground);
        }

        .debug-console-messages {
            flex: 1;
            overflow-y: auto;
            padding: 0.5rem;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: var(--vscode-editor-line-height, 1.5);
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .console-message {
            display: flex;
            gap: 0.5rem;
            padding: 2px 0;
        }

        .console-message-timestamp {
            color: var(--vscode-terminal-foreground);
            opacity: 0.5;
            font-size: 0.9em;
            user-select: none;
        }

        .console-message-content {
            flex: 1;
            font-family: var(--vscode-editor-font-family);
        }

        .console-message.error .console-message-content {
            color: var(--vscode-terminal-ansiRed);
        }

        .console-message.input .console-message-content {
            color: var(--vscode-terminal-ansiYellow);
            font-style: italic;
        }

        .console-message.system .console-message-content {
            color: var(--vscode-terminal-ansiBlue);
        }

        .debug-console-input-wrapper {
            padding: 0.5rem;
            border-top: 1px solid var(--vscode-panel-border);
        }

        .monaco-input-box {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .monaco-input {
            width: 100%;
            padding: 4px 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
        }

        .monaco-input:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: -1px;
        }

        .monaco-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .status-info {
            font-size: 11px;
            color: var(--vscode-terminal-foreground);
            opacity: 0.7;
        }
    `;

    private element: HTMLElement;
    private messages: ConsoleMessage[] = [];
    private inputEnabled: boolean = false;
    private onInputCallback?: (input: string) => void;

    constructor() {
        this.element = this.createElement();
        this.setupEventListeners();
    }

    private createElement(): HTMLElement {
        const temp = document.createElement('div');
        temp.innerHTML = ConsoleView.template;
        return temp.firstElementChild as HTMLElement;
    }

    private setupEventListeners() {
        const input = this.element.querySelector('.terminal-input') as HTMLInputElement;
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.inputEnabled && input.value.trim()) {
                const value = input.value;
                input.value = '';
                this.appendMessage('input', value);
                this.onInputCallback?.(value);
            }
        });
    }

    private formatTimestamp(timestamp: number): string {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    private createMessageElement(message: ConsoleMessage): HTMLElement {
        const div = document.createElement('div');
        div.className = `terminal-message ${message.type}`;
        
        const timestamp = document.createElement('span');
        timestamp.className = 'terminal-timestamp';
        timestamp.textContent = this.formatTimestamp(message.timestamp);
        
        const content = document.createElement('span');
        content.className = 'terminal-content';
        content.textContent = message.content;
        
        div.appendChild(timestamp);
        div.appendChild(content);
        
        return div;
    }

    public appendMessage(type: ConsoleMessage['type'], content: string) {
        const message: ConsoleMessage = {
            type,
            content,
            timestamp: Date.now()
        };
        
        this.messages.push(message);
        
        const messagesContainer = this.element.querySelector('.terminal-output');
        if (messagesContainer) {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    public clear() {
        this.messages = [];
        const messagesContainer = this.element.querySelector('.terminal-output');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }

    public setInputEnabled(enabled: boolean, placeholder?: string) {
        this.inputEnabled = enabled;
        const input = this.element.querySelector('.terminal-input') as HTMLInputElement;
        if (input) {
            input.disabled = !enabled;
            if (placeholder) {
                input.placeholder = placeholder;
            }
        }
    }

    public setStatus(status: string) {
        const statusElement = this.element.querySelector('.status-text');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    public onInput(callback: (input: string) => void) {
        this.onInputCallback = callback;
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public static getStyles(): string {
        return ConsoleView.styles;
    }
}