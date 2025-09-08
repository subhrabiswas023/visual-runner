import type { WebviewApi } from 'vscode-webview';

const vscode: WebviewApi<unknown> = acquireVsCodeApi();

export default vscode;