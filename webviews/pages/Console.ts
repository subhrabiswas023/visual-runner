import App from "../components/Console.svelte";

const target = document.getElementById('app');
if (!target) {
    console.error('Failed to find app target element');
    throw new Error('Failed to find app target element');
}

const app = new App({
    target
});

export default app;