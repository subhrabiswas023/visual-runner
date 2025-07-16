# Contribution Guidelines for Visual Runner

This document provides strict instructions for AI agents contributing to the Visual Runner extension. **Follow every section carefully.**

## ⚙️ Workflow Instructions

When starting a new task:

1. Read `FEATURES.md` and `DESIGN.md` if get lost.
2. Focus on file organization to start design and implementation.
3. Go through the following design services:
    - **UI/UX Frontend:** The look, components, and styles
    - **Middleware:** Actions connecting the frontend and backend
    - **Backend:** The logic and data management
4. Add `TODO` comments mentioning what to do in deeper implementation.
5. Remove `TODO` comments when the task is completed with comments that have been done.

## References and Resources Guidelines

- [Visual Studio Code API](https://code.visualstudio.com/api)
- [Visual Studio Code Extension Sample](https://github.com/microsoft/vscode-extension-samples)

1. Follow `GitHub` for best practices and common patterns.
2. Use **framkeworks** and **libraries** commonly used in popular VS Code extensions to avoid reinventing the wheel and redundancy.

## 🧩 Styling Guidelines

- ✅ Respect VS Code **current user theme** and **built-in styles**.
- ❌ Do NOT introduce **custom styles** or **hardcoded CSS values** unless necessary.

## 🔁 File Structure Rules

- ✅ Use the **existing folder and files** what they are meant for and avoid redundant file creation.
- ❌ Do NOT leave **unused files**. Mark **deprecated files** with a comment if unsure.
