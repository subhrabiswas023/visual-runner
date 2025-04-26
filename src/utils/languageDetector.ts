import * as vscode from 'vscode';
import * as path from 'path';
import { LanguageParser } from '../parsers/pythonParser';
import { PythonParser } from '../parsers/pythonParser';
import { JavaScriptParser } from '../parsers/javascriptParser';

export interface LanguageConfig {
    id: string;
    extensions: string[];
    parser: LanguageParser;
    command: string;
    args: string[];
}

export class LanguageDetector {
    private static readonly SUPPORTED_LANGUAGES: LanguageConfig[] = [
        {
            id: 'python',
            extensions: ['.py'],
            parser: new PythonParser(),
            command: 'python',
            args: ['-u']  // Unbuffered output
        },
        {
            id: 'javascript',
            extensions: ['.js', '.mjs'],
            parser: new JavaScriptParser(),
            command: 'node',
            args: []
        }
        // TODO: Add more language configurations
    ];

    static detectLanguage(filePath: string): LanguageConfig | undefined {
        const ext = path.extname(filePath).toLowerCase();
        return this.SUPPORTED_LANGUAGES.find(lang => 
            lang.extensions.includes(ext)
        );
    }

    static getParser(filePath: string): LanguageParser | undefined {
        return this.detectLanguage(filePath)?.parser;
    }

    static async isFileSupported(filePath: string): Promise<boolean> {
        return !!this.detectLanguage(filePath);
    }

    static getExecutionConfig(filePath: string): { command: string; args: string[] } | undefined {
        const config = this.detectLanguage(filePath);
        if (!config) {
            return undefined;
        }

        return {
            command: config.command,
            args: [...config.args, filePath]
        };
    }
}