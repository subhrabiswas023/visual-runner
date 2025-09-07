# Webviews Architecture

This folder contains all the frontend code for the Visual Runner's WebView panels. The code is built using **Svelte** and bundled with **Rollup**.

## Component Philosophy

The component structure in this project follows a specific set of conventions to ensure clarity and maintainability. This approach is inspired by the file-system-based organization of modern frameworks like SvelteKit and Next.js, rather than a flat structure common in simple component libraries.

### Core Principles

1. **Hierarchical Structure:** Components are organized in folders that mirror the UI's structure.
2. **Contextual Naming:** Component files are given short, specific names (e.g., `Line.svelte`). Their context is derived from their location in the file tree (e.g., `output/Line.svelte`).
3. **File Naming Convention:** Component files are always named after the component itself (e.g., `Console.svelte`), **not** `index.svelte`, to avoid confusion in the editor.
4. **No Ambiguous Suffixes:** We avoid suffixes like `View` (e.g., `OutputView`) to prevent confusion with the VS Code Extension API's `*View` types.

### Example Structure

```plaintext
/webviews
│
├── components/
│   │
│   ├── Console.svelte      // The main component, orchestrates the others
│   │
│   ├── output/
│   │   ├── Output.svelte   // Manages the list of output lines
│   │   └── Line.svelte     // Renders a single output line
│   │
│   └── input/
│       ├── Input.svelte    // Manages the prompt and the input field
│       └── Prompt.svelte   // Renders the '>' prompt symbol
│
├── stores/                 // Svelte stores for state management
│   └── consoleStore.js
│
└── main.js                 // The entry point that mounts the Svelte app
```
