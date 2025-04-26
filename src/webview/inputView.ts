import * as vscode from 'vscode';

export interface InputViewState {
    id: string;
    name: string;
    content: string;
    color?: string;
}

export class InputView {
    private static readonly template = `
        <div class="monaco-editor-group">
            <div class="monaco-editor-header">
                <div class="monaco-editor-title">
                    <div class="monaco-icon-label">
                        <span class="codicon codicon-file" style="color: var(--color)"></span>
                        <span class="label-name"></span>
                    </div>
                </div>
                <div class="monaco-actions-bar">
                    <ul class="actions-container">
                        <li class="action-item">
                            <a class="action-label codicon codicon-edit" role="button" title="Rename"></a>
                        </li>
                        <li class="action-item">
                            <a class="action-label codicon codicon-symbol-color" role="button" title="Change Color"></a>
                        </li>
                        <li class="action-item">
                            <a class="action-label codicon codicon-trash" role="button" title="Delete"></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="monaco-editor-container">
                <textarea class="monaco-editor input-content" spellcheck="false" wrap="off"></textarea>
            </div>
        </div>
    `;

    private static readonly styles = `
        .monaco-editor-group {
            display: flex;
            flex-direction: column;
            margin: 0.5rem;
            border-radius: 4px;
            overflow: hidden;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
        }

        .monaco-editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.5rem;
            height: 28px;
            background: var(--vscode-sideBarSectionHeader-background);
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .monaco-editor-title {
            display: flex;
            align-items: center;
        }

        .monaco-icon-label {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
        }

        .monaco-actions-bar {
            display: flex;
            align-items: center;
        }

        .actions-container {
            display: flex;
            gap: 0.25rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .action-item {
            display: flex;
            align-items: center;
        }

        .action-label {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            color: var(--vscode-icon-foreground);
            text-decoration: none;
            cursor: pointer;
        }

        .action-label:hover {
            background: var(--vscode-toolbar-hoverBackground);
            color: var(--vscode-toolbar-hoverForeground);
        }

        .monaco-editor-container {
            flex: 1;
            min-height: 100px;
            position: relative;
        }

        .input-content {
            width: 100%;
            height: 100%;
            min-height: 100px;
            padding: 0.5rem;
            border: none;
            resize: vertical;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            line-height: var(--vscode-editor-line-height, 1.5);
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            tab-size: 4;
        }

        .input-content:focus {
            outline: 1px solid var(--vscode-focusBorder);
            outline-offset: -1px;
        }
    `;

    private element: HTMLElement;
    private state: InputViewState;
    private onChangeCallback?: (state: InputViewState) => void;

    constructor(state: InputViewState) {
        this.state = state;
        this.element = this.createElement();
        this.setupEventListeners();
    }

    private createElement(): HTMLElement {
        const temp = document.createElement('div');
        temp.innerHTML = InputView.template;
        const element = temp.firstElementChild as HTMLElement;
        
        // Set initial state
        this.updateView();
        
        return element;
    }

    private updateView() {
        const nameElement = this.element.querySelector('.label-name');
        const contentElement = this.element.querySelector('.input-content') as HTMLTextAreaElement;
        
        if (nameElement) {
            nameElement.textContent = this.state.name;
        }
        
        if (contentElement) {
            contentElement.value = this.state.content;
        }

        if (this.state.color) {
            this.element.style.setProperty('--color', this.state.color);
        }
    }

    private setupEventListeners() {
        const content = this.element.querySelector('.input-content') as HTMLTextAreaElement;
        const renameButton = this.element.querySelector('.codicon-edit');
        const colorButton = this.element.querySelector('.codicon-symbol-color');
        const deleteButton = this.element.querySelector('.codicon-trash');

        content?.addEventListener('input', () => {
            this.state.content = content.value;
            this.notifyChange();
        });

        renameButton?.addEventListener('click', () => this.handleRename());
        colorButton?.addEventListener('click', () => this.handleColorChange());
        deleteButton?.addEventListener('click', () => this.handleDelete());
    }

    private async handleRename() {
        const newName = await vscode.window.showInputBox({
            value: this.state.name,
            prompt: 'Enter new name for input view',
            validateInput: value => 
                value.trim().length === 0 ? 'Name cannot be empty' : null
        });

        if (newName) {
            this.state.name = newName;
            this.updateView();
            this.notifyChange();
        }
    }

    private async handleColorChange() {
        // TODO: Implement color picker
        // For now, cycle through some VS Code theme-friendly colors
        const colors = [
            'var(--vscode-charts-blue)',
            'var(--vscode-charts-green)',
            'var(--vscode-charts-orange)',
            'var(--vscode-charts-purple)',
            'var(--vscode-charts-red)',
            'var(--vscode-charts-yellow)'
        ];

        const currentIndex = colors.indexOf(this.state.color || colors[0]);
        this.state.color = colors[(currentIndex + 1) % colors.length];
        this.updateView();
        this.notifyChange();
    }

    private handleDelete() {
        // TODO: Implement deletion with confirmation
        this.element.remove();
    }

    private notifyChange() {
        this.onChangeCallback?.(this.state);
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public getState(): InputViewState {
        return { ...this.state };
    }

    public setState(state: Partial<InputViewState>) {
        this.state = { ...this.state, ...state };
        this.updateView();
    }

    public onChange(callback: (state: InputViewState) => void) {
        this.onChangeCallback = callback;
    }

    public static getStyles(): string {
        return InputView.styles;
    }
}