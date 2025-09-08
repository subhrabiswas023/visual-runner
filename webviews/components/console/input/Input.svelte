<script lang='ts'>
    import Prompt from './prompt/Prompt.svelte';
    import Field from './field/Field.svelte';

</script>

<div id="input-container">
    <Prompt />
    <Field />
</div>

<style>
    #input-container {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        border-top: 1px solid var(--vscode-panel-border);
        background-color: var(--vscode-panel-background);
        /* min-height: 28px; */
    }
</style>