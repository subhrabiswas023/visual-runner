import { signal, computed } from '@preact/signals';
import { useEffect, useRef } from 'preact/hooks';
import { VSCodeAPI } from '../utilities/vscode';

interface ConsoleMessage {
    type: 'output' | 'error' | 'input' | 'system';
    content: string;
    timestamp: number;
}

const messages = signal<ConsoleMessage[]>([]);
const inputEnabled = signal(false);
const inputPlaceholder = signal('Type input here...');
const isProcessing = signal(false);

export function ConsoleView() {
    const messagesRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const vscode = VSCodeAPI.get();
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'consoleOutput':
                    messages.value = [...messages.value, {
                        type: 'output',
                        content: message.value,
                        timestamp: Date.now()
                    }];
                    isProcessing.value = false;
                    break;
                case 'consoleError':
                    messages.value = [...messages.value, {
                        type: 'error',
                        content: message.value,
                        timestamp: Date.now()
                    }];
                    isProcessing.value = false;
                    break;
                case 'clearConsole':
                    messages.value = [];
                    isProcessing.value = false;
                    break;
                case 'setInputEnabled':
                    inputEnabled.value = message.value.enabled;
                    inputPlaceholder.value = message.value.placeholder || 'Type input here...';
                    if (message.value.enabled && inputRef.current) {
                        inputRef.current.focus();
                    }
                    break;
                case 'processing':
                    isProcessing.value = message.value;
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages.value]);

    const handleInput = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (e instanceof KeyboardEvent && e.key === 'Enter' && input.value.trim()) {
            const value = input.value;
            input.value = '';
            isProcessing.value = true;
            
            // Add input to messages
            messages.value = [...messages.value, {
                type: 'input',
                content: value,
                timestamp: Date.now()
            }];

            // Send to extension
            VSCodeAPI.get().postMessage({
                command: 'consoleInput',
                value
            });
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'l':
                    e.preventDefault();
                    VSCodeAPI.get().postMessage({ command: 'clearConsole' });
                    break;
            }
        }
    };

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            input.addEventListener('keydown', handleKeyDown);
            return () => input.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div 
            className="debug-console-container"
            role="log"
            aria-label="Debug Console"
        >
            <div 
                className="debug-console-messages" 
                ref={messagesRef}
                role="log"
                aria-live="polite"
            >
                {messages.value.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`console-message ${msg.type}`}
                        role="listitem"
                        aria-label={`${msg.type} message: ${msg.content}`}
                    >
                        <span 
                            className="console-message-timestamp"
                            aria-label={`Timestamp: ${formatTimestamp(msg.timestamp)}`}
                        >
                            {formatTimestamp(msg.timestamp)}
                        </span>
                        <span className="console-message-content">
                            {msg.content}
                        </span>
                    </div>
                ))}
                {isProcessing.value && (
                    <div className="console-message system" role="status">
                        <span className="console-message-content processing">Processing...</span>
                    </div>
                )}
            </div>
            <div className="debug-console-input-wrapper">
                <div 
                    className="monaco-input-box"
                    role="textbox"
                    aria-label={inputPlaceholder.value}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className="monaco-input"
                        placeholder={inputPlaceholder.value}
                        disabled={!inputEnabled.value}
                        onKeyPress={handleInput}
                        aria-disabled={!inputEnabled.value}
                    />
                </div>
            </div>
        </div>
    );
}