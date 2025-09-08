<script lang="ts">
    import Output from './output/Output.svelte';
    import Input from './input/Input.svelte';
</script>

<div class="console-container">
    <Output />
    <Input />
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
</style>
