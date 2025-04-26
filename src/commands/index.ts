import { runFile } from './runFile';
import { suspendExecution } from './suspendExecution';
import { rerunFile } from './rerunFile';
import { stopExecution } from './stopExecution';

export const commands = {
    'visual-runner.runFile': runFile,
    'visual-runner.suspendExecution': suspendExecution,
    'visual-runner.rerunFile': rerunFile,
    'visual-runner.stopExecution': stopExecution
};