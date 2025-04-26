import * as vscode from 'vscode';

interface ThemeColors {
    background: string;
    foreground: string;
    errorForeground: string;
    inputBackground: string;
    inputForeground: string;
    buttonBackground: string;
    buttonForeground: string;
    buttonHoverBackground: string;
    linkForeground: string;
    borderColor: string;
    // Additional VS Code specific colors
    editorBackground: string;
    editorForeground: string;
    sideBarBackground: string;
    panelBackground: string;
    statusBarBackground: string;
    focusBorder: string;
}

export class ThemeManager {
    private static instance: ThemeManager;
    private currentTheme: ThemeColors;
    private changeCallbacks: ((colors: ThemeColors) => void)[] = [];

    private constructor() {
        this.currentTheme = this.getThemeColors();
        
        // Listen for theme changes
        vscode.window.onDidChangeActiveColorTheme(() => {
            this.currentTheme = this.getThemeColors();
            this.notifyThemeChange();
        });
    }

    static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    getThemeColors(): ThemeColors {
        return {
            background: this.getColor('editor.background'),
            foreground: this.getColor('editor.foreground'),
            errorForeground: this.getColor('errorForeground'),
            inputBackground: this.getColor('input.background'),
            inputForeground: this.getColor('input.foreground'),
            buttonBackground: this.getColor('button.background'),
            buttonForeground: this.getColor('button.foreground'),
            buttonHoverBackground: this.getColor('button.hoverBackground'),
            linkForeground: this.getColor('textLink.foreground'),
            borderColor: this.getColor('panel.border'),
            // Additional VS Code colors
            editorBackground: this.getColor('editor.background'),
            editorForeground: this.getColor('editor.foreground'),
            sideBarBackground: this.getColor('sideBar.background'),
            panelBackground: this.getColor('panel.background'),
            statusBarBackground: this.getColor('statusBar.background'),
            focusBorder: this.getColor('focusBorder')
        };
    }

    getWebviewStyles(): string {
        return `
            :root {
                ${this.getCssVariables()}
            }
        `;
    }

    private getCssVariables(): string {
        const theme = vscode.window.activeColorTheme;
        const editor = vscode.workspace.getConfiguration('editor');

        return `
            --vscode-editor-background: ${this.getColor('editor.background')};
            --vscode-editor-foreground: ${this.getColor('editor.foreground')};
            --vscode-input-background: ${this.getColor('input.background')};
            --vscode-input-foreground: ${this.getColor('input.foreground')};
            --vscode-input-border: ${this.getColor('input.border')};
            --vscode-button-background: ${this.getColor('button.background')};
            --vscode-button-foreground: ${this.getColor('button.foreground')};
            --vscode-button-hoverBackground: ${this.getColor('button.hoverBackground')};
            --vscode-errorForeground: ${this.getColor('errorForeground')};
            --vscode-panel-border: ${this.getColor('panel.border')};
            --vscode-font-family: ${editor.get('fontFamily', 'var(--vscode-font-family)')};
            --vscode-font-size: ${editor.get('fontSize', '13')}px;
            --vscode-font-weight: ${editor.get('fontWeight', 'normal')};
            --vscode-input-placeholderForeground: ${this.getColor('input.placeholderForeground')};
            --vscode-terminal-foreground: ${this.getColor('terminal.foreground')};
            --vscode-terminal-background: ${this.getColor('terminal.background')};
            --vscode-terminal-ansiRed: ${this.getColor('terminal.ansiRed')};
            --vscode-terminal-ansiYellow: ${this.getColor('terminal.ansiYellow')};
            --vscode-terminal-ansiBlue: ${this.getColor('terminal.ansiBlue')};
        `;
    }

    private getColor(colorId: string): string {
        const color = new vscode.ThemeColor(colorId);
        // Convert theme color to CSS variable reference
        return `var(--vscode-${colorId.replace(/\./g, '-')})`;
    }

    onThemeChange(callback: (colors: ThemeColors) => void): vscode.Disposable {
        this.changeCallbacks.push(callback);
        return new vscode.Disposable(() => {
            const index = this.changeCallbacks.indexOf(callback);
            if (index !== -1) {
                this.changeCallbacks.splice(index, 1);
            }
        });
    }

    private notifyThemeChange(): void {
        const colors = this.getThemeColors();
        this.changeCallbacks.forEach(callback => callback(colors));
    }
}