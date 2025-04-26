import { runFile } from './runFile';

export async function rerunFile() {
    // TODO: Clear previous execution state
    // TODO: Reset input simulator state
    // TODO: Clear console output in WebView
    // TODO: Re-initialize process with same configuration
    
    // Re-run the file by directly calling runFile function
    await runFile();
}