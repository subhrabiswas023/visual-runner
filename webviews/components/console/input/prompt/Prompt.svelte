<script lang='ts'></script>

<div class="console-prompt"></div>

<style>
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