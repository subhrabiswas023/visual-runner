declare global {
    interface Window {
        acquireVsCodeApi(): {
            postMessage(message: unknown): void;
            setState(state: unknown): void;
            getState(): unknown;
        };
    }
}

export class VSCodeAPI {
    private static instance: ReturnType<typeof window.acquireVsCodeApi>;

    private constructor() {
        // Private to prevent direct construction
    }

    public static get(): ReturnType<typeof window.acquireVsCodeApi> {
        if (!this.instance) {
            this.instance = window.acquireVsCodeApi();
        }
        return this.instance;
    }
}