<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { outputs } from "@stores/outputs";
    import type { VSCodeMessage } from "@common/types";
    import Line from "./line/Line.svelte";

    let outputContainer: HTMLDivElement;

    // FIX: className param should be optional
    function appendOutput(text: string, className: string = "") {
        console.log("Appending output:", text);
        const lines = text.split("\n");

        outputs.update((current) => {
            console.log("Current outputs:", current);
            const newOutputs = [
                ...current,
                ...lines.map((line) => ({ text: line, class: className })),
            ];
            console.log("New outputs:", newOutputs);
            return newOutputs;
        });

        // Wait for update then scroll
        setTimeout(() => {
            if (outputContainer) {
                console.log("Scrolling output container");
                outputContainer.scrollTo(0, outputContainer.scrollHeight);
            } else {
                console.warn("Output container not available");
            }
        }, 0);
    }

    function messageHandler(event: MessageEvent<VSCodeMessage>) {
        console.log("Received message:", event.data);
        const message = event.data;
        switch (message.command) {
            case "appendOutput":
                appendOutput(message.text);
                break;
        }
    }

    onMount(() => {
        appendOutput("Svelte Console Initialized"); // Debugging purpose
        window.addEventListener("message", messageHandler);
    });

    onDestroy(() => {
        window.removeEventListener("message", messageHandler);
    });
</script>

<div id="output-container" bind:this={outputContainer}>
    {#each $outputs as line}
        <Line {line} />
    {/each}
</div>

<style>
    #output-container {
        flex-grow: 1;
        overflow-y: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        user-select: text;
    }
</style>
