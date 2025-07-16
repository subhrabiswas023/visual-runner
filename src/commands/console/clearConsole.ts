import { getCommandContext } from "../context";

export async function clearConsole() {
    const { consoleProvider } = await getCommandContext();
    consoleProvider.clear();
}