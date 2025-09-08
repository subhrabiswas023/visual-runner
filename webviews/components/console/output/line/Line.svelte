<script lang="ts">
    interface OutputLine {
        text: string;
        class?: string;
    }

    export let line: OutputLine;
</script>

<div class="output-line {line.class ?? ''}">
    {line.text}
</div>

<style>
    .output-line {
        padding: 3px 20px;
        transition: background-color 0.2s ease;
    }

    .output-line:hover {
        background-color: var(--vscode-list-hoverBackground);
    }
</style>