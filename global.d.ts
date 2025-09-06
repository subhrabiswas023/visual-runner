declare module 'global' {
    global {
        interface Window {
            vscode: {
                postMessage: <T extends unknown>(message: T) => void;
            };
        }
    }
}