# 🧩 Visual Runner – Refined UI/UX Features

## 🎯 Core Goals

- Provide a **clean, language-agnostic input-output console**.
- Avoid **terminal clutter** by using a `WebView`.
- Offer an experience similar to the inspiration from VS Code's `Debug Console`, but extensible for any language.

## 🪟 VISUAL RUNNER

## 🟩 1. INPUTS (View)

### 📝 Multi-line Input Editor

- Acts as a `stdin` simulation.
- **Text editor** where users type input required for execution.
- The **input** is fetched and injected into the `interactive console` as user input.

### 💾 Persistent Input Storage

- Saves the inputs used corresponding to the file and the workspace in the extension storage. However, it allows exporting to the workspace also.
- Auto-loads stored inputs on the change of the connected file.
- The connected file is synced to the active editor file but it can also be pinned to a particular file.

### 🪟 Multiple Input Items

- Allows adding multiple input items
- Item name
  - Starts follows 'Input {number}'
    - The `number` is one more than the number of inputs
    - Or it can be one more than the the number of this format with the largest number. (experimental)
- Each item can be
  - Renamed
  - Color-coded
- Allows running the sessions using multiple of those inputs in the following modes
  - sequential
  - parallel (experimental)

## 🟦 2. VISUAL CONSOLE (Panel Webview)

### 🧾 Clean Display

- No command line clutter, pure console interface.
- Syntax-highlighted with color coding:
  - Theme error, warning(experimental) and success(experimental)
  - Italic user input (typed or inserted from input view) (a distinct theme color)
  - Color tokenization from VS Code theme or user settings

### 💬 Interaction Text Field

- Text field at the bottom is bind to the cursor (distigusihed style from the user) location where the input is required.
- The cursor is focused on the text field if the user has not moved away from focusing text field.
- Disabled while
  - Input is fetched
  - Process is not listening to `stdin`
- Placeholder mentions the state
  - "Type here to input"
  - "Fetching from inputs..."
  - "Executing..."

## 🟨 3. Execution Controls In The Editor Menu

### 🔲 Buttons

- ▶️ **Rune**
  - Executes the code.
  - Opens the console.
  - A play button
  - Changes to a pause button when activated
- ⏸️ **Pause**:
  - Pauses the execution.
  - Remembers the context where it was paused
  - Changes to a resume button when activated
- 🔃 **Resume**
  - Re-executes the code.
  - Starts a new session in the console.
  - Changes to a pause button when activated
- ⏹️ **Stop**
  - Gracefully kills the process.
  - Stops the execution.

### 🧠 Smart Execution Handler

- Detects language from active file. (e.g., `.py`, `.js`, `.java`)
- Runs via clean `subprocess`, no interference with VS code's built-in terminal.
- Error handling:
  - Error from the process is displayed in the console.
  - Displays external errors in the editor with a user-friendly message.

### Temporary File Creation (experimental)

- Customizable output file creation (e.g., `.exe`, `.class`)
  - In the workspace
  - In `cache`
    - Runs those from cache if the source file remains unchanged. otherwise runs the entire file again.
    - Policy based clean up (e.g. time).
