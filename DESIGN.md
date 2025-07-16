# 📐 Visual Runner - Technical Design Document

## 📁 Project Structure

```plaintext
src/
├── extension.ts              # Extension entry point
├── commands/                 # Command implementations
│   ├── Inputs                # Input view commands
│   │   ├── addInput.ts       # Add input command
│   │   ├── deleteInput.ts    # Remove input command
│   │   ...
│   ├── Console               # Console commands
│   |   ├── clearConsole.ts       # Clear console command
│   |   ...
│   ├── Execution             # Execution commands
│   |   ├── rerunFile.ts         # Rerun command
│   |   ├── stopExecution.ts     # Stop command
│   |   ...
|   ├── context.ts            # Imports and manages context
|   └── index.ts              # Exports all commands
├── webview/                  # WebView implementation
|   ├── components                # UI components
|   │   ├── App.tsx               # WebView panel manager
|   │   ├── InputView.tsx         # Input view component
|   │   ├── ConsoleView.tsx       # Console view component
|   ├── styles                # CSS styles
|   │   ├── index.css             # WebView styles
|   │   ├── theme.css             # Theme styles
|   ├── views               # WebView views
|   │   ├── inputView.tsx         # Input view UI
|   │   ├── consoleView.tsx       # Console view UI
├── execution/               # Execution handling
│   ├── executor.ts         # Language-agnostic executor
│   ├── processManager.ts   # Process lifecycle management
│   └── inputSimulator.ts   # stdin simulation
├── storage/                # Data persistence
│   ├── inputStorage.ts     # Input view storage
│   └── cacheManager.ts     # Temporary file cache
├── parsers/               # Language-specific parsers
│   ├── pythonParser.ts    # Python error/output parser
│   ├── javascriptParser.ts # JavaScript parser
│   └── javaParser.ts      # Java parser
└── utils/                 # Utility functions
    ├── languageDetector.ts # File type detection
    └── themeManager.ts    # Theme integration

.vscode/
└── .runner/              # Extension workspace storage
    └── inputs/           # Stored input files
```

## 🔧 Core Components

### 1. Extension Activation

- Register commands using VS Code's command system
- Initialize WebView panel with serialization support
- Set up file system watchers for cache invalidation
- Load stored inputs and settings

### 2. WebView Implementation

#### Panel Manager (App.tsx)

- Built with Preact for lightweight, efficient UI
- Uses Preact Signals for state management
- Implements message passing protocol
- Retains context across editor sessions

#### Input View (InputsView.tsx)

- Preact functional component with hooks
- Input view management using Signals
- Input persistence and state restoration
- Export/import functionality

#### Console View (ConsoleView.tsx)

- Preact-based console interface
- Integrated syntax highlighting
- Interactive input handling with Signals
- Process state visualization using Preact components

### 3. Execution System

#### Process Manager (processManager.ts)

- Spawn and manage child processes
- Handle IPC communication
- Process lifecycle management
- Error handling and recovery

#### Input Simulator (inputSimulator.ts)

- Custom Readable stream implementation
- stdin simulation
- Input queue management
- State machine for input handling

### 4. Storage System

#### Input Storage (inputStorage.ts)

- Workspace state management
- File system storage (.vscode/.runner/inputs/)
- Input view configuration persistence
- Auto-loading mechanism

#### Cache Manager (cacheManager.ts)

- Temporary file management
- Cache invalidation strategy
- Policy-based cleanup
- Source file change detection

## ⚙️ Configuration Options

### 1. Visual Settings

- \`visualRunner.theme.useEditorColors\`: Use VS Code theme colors
- \`visualRunner.console.fontFamily\`: Console font family
- \`visualRunner.console.fontSize\`: Console font size
- \`visualRunner.input.defaultColor\`: Default input view color

### 2. Execution Settings

- \`visualRunner.execution.timeout\`: Process timeout (ms)
- \`visualRunner.execution.maxBuffer\`: Maximum output buffer size
- \`visualRunner.execution.shell\`: Custom shell for execution
- \`visualRunner.cache.lifetime\`: Cache cleanup interval

### 3. Storage Settings

- \`visualRunner.storage.location\`: Input storage location
- \`visualRunner.storage.maxSize\`: Maximum storage size
- \`visualRunner.storage.autoSave\`: Auto-save frequency

### 4. Input View Settings

- \`visualRunner.input.maxViews\`: Maximum number of input views
- \`visualRunner.input.defaultMode\`: Default execution mode (sequential/parallel)
- \`visualRunner.input.autoFocus\`: Auto-focus behavior

## 🔄 State Management

### WebView State

- Current file information
- Input view configurations
- Console content and state
- Process execution state

### Workspace State

- Stored inputs per file
- View configurations
- Cache information
- User preferences

## 🔌 Message Protocol

### VS Code → WebView

- File changes through Preact state updates
- Execution state managed by Signals
- Process output through component props
- Theme updates via CSS variables

### WebView → VS Code

- Input submission via Preact event handlers
- Command triggers through VSCode API
- View configuration through Signals
- State synchronization with Extension Context

## 🛡️ Error Handling

### Process Errors

- Language-specific error parsing
- User-friendly error messages
- Error location highlighting
- Recovery procedures

### Runtime Errors

- Extension error handling
- WebView error recovery
- Process cleanup
- State restoration

## 🔒 Security Considerations

- Input validation
- Process isolation
- File system access control
- WebView content security policy

## 🎨 UI/UX Guidelines

### Component Architecture

- Functional Preact components
- Signal-based state management
- CSS-in-JS with VS Code theming
- Accessibility-first approach

### Input View

- Preact-powered input management
- Reactive state updates
- VS Code-native styling
- Keyboard event handling

### Console

- Virtualized output rendering
- Signal-driven updates
- VS Code theme integration
- Error boundary protection
