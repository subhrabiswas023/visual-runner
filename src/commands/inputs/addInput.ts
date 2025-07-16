import { getCommandContext } from '../context';

export async function addInput() {
    const { inputsProvider } = await getCommandContext();

    const inputCount = inputsProvider['inputs'].length;
    inputsProvider.addInput(`Input ${inputCount + 1}`);
}