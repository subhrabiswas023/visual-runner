// Svelte 5 migration
// you should use mount or hydrate (imported from svelte) instead.
import { mount } from 'svelte';
import App from '../components/console/Console.svelte';

const app = mount(App, {
    target: document.getElementById('app')!
});

export default app;