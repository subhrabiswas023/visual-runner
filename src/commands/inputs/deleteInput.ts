import { InputItem } from "../../webview/views/inputsProvider";
import { getCommandContext } from "../context";

export async function deleteInput(item: InputItem) {
    const { inputsProvider } = await getCommandContext();

    const index = inputsProvider['inputs'].findIndex(i => i === item);
    if (index !== -1) {
        inputsProvider.removeInput(index);
    }
}