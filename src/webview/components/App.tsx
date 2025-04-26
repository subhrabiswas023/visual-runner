import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { ConsoleView } from '../components/ConsoleView';
import { InputView, InputViewState } from '../components/InputView';
import { VSCodeAPI } from '../utilities/vscode';

// State management using signals
export const isRunning = signal(false);
export const isSuspended = signal(false);
export const inputViews = signal<InputViewState[]>([]);

export function App() {
    useEffect(() => {
        const vscode = VSCodeAPI.get();
        
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'stateUpdate':
                    isRunning.value = message.running;
                    isSuspended.value = message.suspended;
                    break;
                case 'setInputViews':
                    inputViews.value = message.value;
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleRun = () => {
        VSCodeAPI.get().postMessage({ command: 'runFile' });
    };

    const handleSuspend = () => {
        VSCodeAPI.get().postMessage({ command: 'suspendExecution' });
    };

    const handleStop = () => {
        VSCodeAPI.get().postMessage({ command: 'stopExecution' });
    };

    const handleDeleteInput = (id: string) => {
        inputViews.value = inputViews.value.filter(view => view.id !== id);
        VSCodeAPI.get().postMessage({ 
            command: 'deleteInput',
            value: id
        });
    };

    return (
        <div className="runner-container">
            <div className="input-section">
                <div className="monaco-toolbar">
                    <button 
                        className="monaco-button button-add-input" 
                        title="Add Input View"
                        onClick={() => VSCodeAPI.get().postMessage({ 
                            command: 'addInput',
                            value: {
                                id: Date.now().toString(),
                                name: 'New Input',
                                content: ''
                            }
                        })}
                    >
                        <span className="codicon codicon-add"></span>
                        Add Input
                    </button>
                </div>
                <div id="input-views" className="input-views-container">
                    {inputViews.value.map(view => (
                        <InputView 
                            key={view.id} 
                            initialState={view}
                            onDelete={handleDeleteInput}
                        />
                    ))}
                </div>
            </div>
            <div className="console-section">
                <div className="monaco-toolbar">
                    <button 
                        className="monaco-button button-run" 
                        title="Run File"
                        onClick={handleRun}
                        disabled={isRunning.value}
                    >
                        <span className="codicon codicon-play"></span>
                        Run
                    </button>
                    <button 
                        className="monaco-button button-suspend" 
                        title="Suspend Execution"
                        onClick={handleSuspend}
                        disabled={!isRunning.value || isSuspended.value}
                    >
                        <span className="codicon codicon-debug-pause"></span>
                        Suspend
                    </button>
                    <button 
                        className="monaco-button button-stop" 
                        title="Stop Execution"
                        onClick={handleStop}
                        disabled={!isRunning.value}
                    >
                        <span className="codicon codicon-debug-stop"></span>
                        Stop
                    </button>
                </div>
                <ConsoleView />
            </div>
        </div>
    );
}