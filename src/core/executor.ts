import { spawn, ChildProcess } from "child_process";
import EventEmitter from "events";

export class Executor extends EventEmitter {
    private process?: ChildProcess;

    run(command: string, args: string[] = []): void {
        this.process = spawn(command, args);

        this.process.stdout?.on("data", (data) => {
            this.emit("stdout", data.toString());
        });

        this.process.stderr?.on("data", (data) => {
            this.emit("stderr", data.toString());
        });

        this.process.on("close", (code) => {
            this.emit("close", code);
            this.process = undefined;
        });
    }

    stop(): void {
        if (this.process) {
            this.process.kill();
            this.process = undefined;
        }
    }

    writeToStdin(data: string): void {
        if (this.process && this.process.stdin) {
            this.process.stdin.write(data);
        }
    }
}