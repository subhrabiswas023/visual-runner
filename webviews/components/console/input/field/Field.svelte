<script lang="ts">
    import { inputValue } from '@stores/input';
    import vscode from 'vscode';

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            let currentValue = '';
            inputValue.subscribe(value => currentValue = value)();
            
            const command = currentValue.trim();
            if (command) {
                // Send command to extension
                vscode.postMessage({ command: 'runCommand', text: command });
                inputValue.set('');
            }
        }
    }
</script>

<input
    id="console-input"
    type="text"
    bind:value={$inputValue}
    on:keydown={handleKeydown}
    spellcheck="false"
    autocomplete="off"
    autofocus
/>

<style>
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
</style>
