import { runFile } from './execution/runFile';
import { suspendExecution } from './execution/suspendExecution';
import { rerunFile } from './execution/rerunFile';
import { stopExecution } from './execution/stopExecution';

import { addInput } from './inputs/addInput';
import { editInput } from './inputs/editInput';
import { deleteInput } from './inputs/deleteInput';

import { clearConsole } from './console/clearConsole';

const extensionId = 'visual-runner';

export const commands = {
    // Inputs commands
    [`${extensionId}.addInput`]: addInput,
    [`${extensionId}.editInput`]: editInput,
    [`${extensionId}.deleteInput`]: deleteInput,

    // Console commands
    [`${extensionId}.clearConsole`]: clearConsole,

    // Execution commands
    [`${extensionId}.runFile`]: runFile,
    [`${extensionId}.rerunFile`]: rerunFile,
    [`${extensionId}.suspendExecution`]: suspendExecution,
    [`${extensionId}.stopExecution`]: stopExecution
};