# 🧩 Visual Runner – Refined UI/UX Features

## 🎯 Core Goals

- Provide a **clean, language-agnostic input-output console**.
- Avoid **terminal clutter** by using a `WebView`.
- Offer an experience similar to the inspiration from VS Code's `Debug Console`, but extensible for any language.

> 💡 **Dev Note:**
> Use `vscode.window.createWebviewPanel()` with retained context and serializer for persistence.

## 🪟 VISUAL RUNNER (Webview) (Left)

- Shows the **name** of the **current file**
- Option to show the **file path**

> 💡 **Dev Note:**
> Subscribe to `window.onDidChangeActiveTextEditor` for active file updates, use `panel.webview.postMessage()` to sync state.

## 🟩 1. INPUTS (View)

### 📝 Multi-line Input Editor

- Acts as a `stdin` simulation.
- **Text editor** where users type input required for execution.
- The **input** is fetched and injected into the `interactive console` as user input.

> 💡 **Dev Note:**
> Implement custom `Readable` stream to simulate stdin, use `process.stdin.write()` for injection.

### 💾 Persistent Input Storage

- Saves the input view used for the active file using seperate storage to store input for the file.
- Auto-loads stored input on panel reopen or rerun.
- Allows exporting the input to a file otherwise stores in an internal storage.

> 💡 **Dev Note:**
> Use `context.workspaceState` for session persistence, store inputs in `.vscode/.runner/inputs/` using `workspace.fs`.

### 🪟 Multiple Input views

- Allows adding multiple input views
- Each view can be
  - Renamed
  - Color-coded
- Allows runnning the sessions using multiple of those inputs in the following modes
  - sequential
  - parallel

> 💡 **Dev Note:**
> Store view configs in `package.json`, use `Promise.all()` for parallel execution, implement queue for sequential.

## 🟦 2. INTERACTIVE CONSOLE (Terminal Webview)

### 🧾 Clean Display

- No command line clutter, pure console interface.
- Syntax-highlighted with color coding:
  - 🟥 Errors → Red
  - 🟨 Warnings → Yellow
  - 🟩 Success → Green
  - Italic user input (typed or inserted from input view)
  - Color tokenization from VS Code theme or user settings

> 💡 **Dev Note:**
> Use `vscode.window.createTextEditorDecorationType()` for styling, integrate with `tokenColors` from active theme.

### 💬 Interaction Text Field

- Text field at the bottom is bind to the cursor (distigusihed style from the user) location where the input is required.
- The cursor is focused on the text field if the user has not moved away from focusing text field.
- Disabled while
  - Input is fetched
  - Process is not listening
- Placeholder mentions the state
  - "Type here to input"
  - "Fetching from inputs..."
  - "Executing..."

> 💡 **Dev Note:**
> Use webview's `postMessage` API for state management, implement custom input queue with state machine.

## 🟨 3. Execution Controls

### 🔲 Buttons

- ▶️ **Run/Resume**
  - Executes the code.
  - Opens the console.
- ⏸️ **Suspend**:
  - Pauses the execution.
- 🔃 **Rerun**
  - Re-executes the code.
  - Starts a new session in the console.
- ⏹️ **Stop**
  - Gracefully kills the process.
  - Stops the execution.

> 💡 **Dev Note:**
> Use `vscode.commands.registerCommand()` for actions, implement using Node's `child_process.spawn()` with IPC.

### 🧠 Smart Execution Handler

- Detects language from active file. (e.g., `.py`, `.js`, `.java`)
- Runs via clean `subprocess`, no interference with VS code's built-in terminal.
- Error handling:
  - Error from the process is displayed in the console.
  - Displays external errors in the editor with a user-friendly message.

> 💡 **Dev Note:**
> Use `vscode.languages.match()` for detection, implement error parsers per language in `src/parsers/`.

### Temporary File Creation

- Customizable output file creation (e.g., `.exe`, `.class`)
  - In the workspace
  - In `cache`
    - Runs those from cache if the source file remains unchanged. otherwise runs the entire file again.
    - Policy based clean up (e.g. time).

> 💡 **Dev Note:**
> Use `os.tmpdir()` for cache, implement file watcher with `workspace.createFileSystemWatcher()` for changes.
