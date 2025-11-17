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

- To keep the project directory clean, inputs are saved by default to the extension's internal storage, separate from the user's workspace files.
- This prevents polluting the project with temporary data.
- Users can optionally export inputs to their workspace if they need to be version-controlled or shared.
- Auto-loads stored inputs when the connected file changes.
- The connected file is synced to the active editor file by default, but can be pinned to a specific file.

### 🪟 Multiple Input Items

- Allows adding multiple distinct input items.
- New items are automatically named 'Input {n}', where 'n' is the next available integer in the sequence.
- Each item can be:
  - Renamed
  - Color-coded
- Allows running sessions using these inputs in two modes:
  - **Sequential**: Runs the program once for each selected input.
  - **Parallel (experimental)**: Runs multiple instances of the program simultaneously with different inputs.

## 🟦 2. VISUAL CONSOLE (Panel Webview)

### 🧾 Clean Display

- No command line clutter, just a pure console interface.
- The program's output is syntax-highlighted for readability.
- Colors used for status (e.g., success, warning, error) are derived from the user's active VS Code theme, allowing for a consistent and customizable look.
- User input is styled distinctly (e.g., italics) to separate it from program output.

### 💬 Interaction Input Field

- A text field at the bottom of the console allows for interactive input.
- Keystrokes in this field are mirrored in the main output view at the current input position, simulating typing directly into the console.
- The input field is disabled while:
  - Input is being fetched from the Inputs View.
  - The running process is not listening for `stdin`.
- The placeholder text indicates the current state:
  - "Type here to input"
  - "Fetching from inputs..."
  - "Executing..."

## 🟨 3. Execution Controls In The Editor Menu

### 🔲 Buttons

- ▶️ **Run**
  - Executes the code.
  - Opens the console.
  - A play button
  - Changes to a pause button when activated
- ⏸️ **Pause**:
  - Pauses the execution.
  - Saves the full execution state (e.g., variables and instruction pointers), similar to the functionality in a debugger, allowing the session to be resumed precisely where it left off.
  - Changes to a resume button when activated
- 🔃 **Resume**
  - Continues execution from a paused state.
  - The console session is restored to where it was left off.
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
