import { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";

export enum SessionEvent {
    Stdout = "stdout",
    Stderr = "stderr",
    Close = "close",
    Error = "error",
}

export interface SessionEvents {
    [SessionEvent.Stdout]: [message: string];
    [SessionEvent.Stderr]: [message: string];
    [SessionEvent.Close]: [code: number | null];
    [SessionEvent.Error]: [error: Error];
}

export class Session extends EventEmitter<SessionEvents> {
    constructor(private _process: ChildProcess) {
        super();

        const { stdin, stdout, stderr } = _process;

        if (!stdin || !stdout || !stderr) {
            throw new Error("Piped stdio streams are required");
        }

        stdout.on("data", (message) => {
            this.emit(SessionEvent.Stdout, message.toString());
        });

        stderr.on("data", (message) => {
            this.emit(SessionEvent.Stderr, message.toString());
        });

        this._process.on("close", (code) => {
            this.emit(SessionEvent.Close, code);
        });
        
        this._process.on("error", (error) => {
            throw error; // FIXME: crashes the extension
        });
    }

    write(data: string): void {
        this._process.stdin?.write(data);
    }

    stop(): void {
        this._process.kill();
    }
}
