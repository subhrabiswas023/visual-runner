import { spawn } from "node:child_process";
import { Session } from "./session";

export function execute(command: string, args: string[] = []): Session {
    const process = spawn(command, args, {
        stdio: ["pipe", "pipe", "pipe"]
    });

    return new Session(process);
}
