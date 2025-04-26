import { signal } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { VSCodeAPI } from '../utilities/vscode';

export interface InputViewState {
    id: string;
    name: string;
    content: string;
    color?: string;
}

interface InputViewProps {
    initialState: InputViewState;
    onDelete?: (id: string) => void;
}

const colors = [
    'var(--vscode-charts-blue)',
    'var(--vscode-charts-green)',
    'var(--vscode-charts-orange)',
    'var(--vscode-charts-purple)',
    'var(--vscode-charts-red)',
    'var(--vscode-charts-yellow)'
];

export function InputView({ initialState, onDelete }: InputViewProps) {
    const state = signal<InputViewState>(initialState);
    const isLoading = signal<boolean>(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleRename = async () => {
        isLoading.value = true;
        const vscode = VSCodeAPI.get();
        vscode.postMessage({
            command: 'showInputBox',
            value: {
                prompt: 'Enter new name for input view',
                value: state.value.name,
                validateInput: (value: string) => 
                    value.trim().length === 0 ? 'Name cannot be empty' : null
            }
        });
    };

    const handleColorChange = () => {
        isLoading.value = true;
        const currentIndex = colors.indexOf(state.value.color || colors[0]);
        state.value = {
            ...state.value,
            color: colors[(currentIndex + 1) % colors.length]
        };
        notifyChange();
        isLoading.value = false;
    };

    const handleDelete = () => {
        isLoading.value = true;
        onDelete?.(state.value.id);
    };

    const handleContentChange = (e: Event) => {
        const textarea = e.target as HTMLTextAreaElement;
        state.value = {
            ...state.value,
            content: textarea.value
        };
        notifyChange();
    };

    const notifyChange = () => {
        VSCodeAPI.get().postMessage({
            command: 'inputChange',
            value: state.value
        });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    notifyChange();
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleRename();
                    break;
            }
        }
    };

    useEffect(() => {
        const textarea = contentRef.current;
        if (textarea) {
            textarea.addEventListener('keydown', handleKeyDown);
            return () => textarea.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    // Listen for input box result
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'inputBoxResult' && message.id === state.value.id) {
                if (message.value) {
                    state.value = {
                        ...state.value,
                        name: message.value
                    };
                    notifyChange();
                }
                isLoading.value = false;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div 
            className={`monaco-editor-group ${isLoading.value ? 'loading' : ''}`}
            role="group"
            aria-label={`Input view: ${state.value.name}`}
        >
            <div className="monaco-editor-header">
                <div className="monaco-editor-title">
                    <div className="monaco-icon-label">
                        <span 
                            className="codicon codicon-file" 
                            style={{ color: state.value.color }}
                            role="img"
                            aria-label="Input file"
                        />
                        <span className="label-name">{state.value.name}</span>
                    </div>
                </div>
                <div className="monaco-actions-bar">
                    <ul className="actions-container" role="toolbar" aria-label="Input actions">
                        <li className="action-item">
                            <a 
                                className={`action-label codicon codicon-edit ${isLoading.value ? 'loading' : ''}`}
                                role="button"
                                aria-label="Rename input"
                                title="Rename (Ctrl+Enter)"
                                onClick={handleRename}
                                aria-disabled={isLoading.value}
                            />
                        </li>
                        <li className="action-item">
                            <a 
                                className={`action-label codicon codicon-symbol-color ${isLoading.value ? 'loading' : ''}`}
                                role="button"
                                aria-label="Change color"
                                title="Change Color"
                                onClick={handleColorChange}
                                aria-disabled={isLoading.value}
                            />
                        </li>
                        <li className="action-item">
                            <a 
                                className={`action-label codicon codicon-trash ${isLoading.value ? 'loading' : ''}`}
                                role="button"
                                aria-label="Delete input"
                                title="Delete"
                                onClick={handleDelete}
                                aria-disabled={isLoading.value}
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="monaco-editor-container">
                <textarea
                    ref={contentRef}
                    className="monaco-editor input-content"
                    value={state.value.content}
                    onChange={handleContentChange}
                    spellcheck={false}
                    wrap="off"
                />
            </div>
        </div>
    );
}