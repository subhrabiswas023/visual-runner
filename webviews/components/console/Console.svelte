<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    
    interface OutputLine {
        text: string;
        class: string;
    }

    interface VSCodeMessage {
        command: 'appendOutput';
        text: string;
    }

    const vscode = (window as any).vscode;
    let outputContainer: HTMLDivElement;
    
    const outputs = writable<OutputLine[]>([]);
    const inputValue = writable('');
    
    function appendOutput(text: string, className: string = '') {
        console.log('Appending output:', text);
        const lines = text.split('\n');
        
        outputs.update(current => {
            console.log('Current outputs:', current);
            const newOutputs = [...current, ...lines.map(line => ({ text: line, class: className }))];
            console.log('New outputs:', newOutputs);
            return newOutputs;
        });
        
        // Wait for update then scroll
        setTimeout(() => {
            if (outputContainer) {
                console.log('Scrolling output container');
                outputContainer.scrollTo(0, outputContainer.scrollHeight);
            } else {
                console.warn('Output container not available');
            }
        }, 0);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            let currentValue = '';
            inputValue.subscribe(value => currentValue = value)();
            
            const command = currentValue.trim();
            if (command) {
                appendOutput(command);
                // Send command to extension
                vscode.postMessage({ command: 'runCommand', text: command });
                inputValue.set('');
            }
        }
    }

    const messageHandler = (event: MessageEvent<VSCodeMessage>) => {
        console.log('Received message:', event.data);
        const message = event.data;
        switch (message.command) {
            case 'appendOutput':
                appendOutput(message.text);
                break;
        }
    };

    onMount(() => {
        console.log('Svelte component mounted');
        appendOutput('Svelte Console Initialized');
        window.addEventListener('message', messageHandler);
    });

    onDestroy(() => {
        window.removeEventListener('message', messageHandler);
    });
</script>

<div class="console-container">
    <div id="output-container" bind:this={outputContainer}>
        {#each $outputs as line}
            <div class="output-line {line.class}">{line.text}</div>
        {/each}
    </div>
    
    <div id="input-container">
        <div class="console-prompt"></div>
        <input 
            id="console-input"
            type="text"
            bind:value={$inputValue}
            on:keydown={handleKeydown}
            spellcheck="false"
            autocomplete="off"
            autofocus
        />
    </div>
</div>

<style>
    :global(html, body, #app) {
        height: 100%;
        margin: 0;
        padding: 0;
    }
    :global(#app) {
        font-family: var(--vscode-editor-font-family);
        font-size: var(--vscode-editor-font-size);
        color: var(--vscode-editor-foreground);
    }

    /* Reuse existing styles */
    .console-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #output-container {
        flex-grow: 1;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        user-select: text;
    }

    .output-line {
        padding: 3px 20px;
        transition: background-color 0.2s ease;
    }

    .output-line:hover {
        background-color: var(--vscode-list-hoverBackground);
    }

    #input-container {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        border-top: 1px solid var(--vscode-panel-border);
        background-color: var(--vscode-panel-background);
        /* min-height: 28px; */
    }

    #console-input {
        flex: 1;
        background: transparent;
        color: var(--vscode-input-foreground);
        border: none;
        padding: 0 4px;
        line-height: 19px;
        font-family: inherit;
        font-size: inherit;
        outline: none;
    }

    .console-prompt {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        color: var(--vscode-terminalCommandDecoration-defaultBackground);
        font-size: 16px;
        user-select: none;
    }

    .console-prompt:before {
        content: ">";
        font-weight: bold;
        font-family: var(--vscode-editor-font-family);
        white-space: nowrap;
    }
</style>
