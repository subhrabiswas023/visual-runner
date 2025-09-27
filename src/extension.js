"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const InputsProvider_1 = require("./views/Inputs/InputsProvider");
const ConsoleProvider_1 = require("./views/console/ConsoleProvider");
function activate(context) {
    const inputsProvider = new InputsProvider_1.InputsProvider();
    const inputsView = vscode.window.registerTreeDataProvider(`${constants_1.EXTENSION_ID}-${inputsProvider.contextValue}`, inputsProvider);
    context.subscriptions.push(inputsView);
    const consoleProvider = new ConsoleProvider_1.ConsoleProvider(context.extensionUri);
    const consoleView = vscode.window.registerWebviewViewProvider(ConsoleProvider_1.ConsoleProvider.viewType, consoleProvider);
    context.subscriptions.push(consoleView);
    const handlers = {
        'inputs.deleteItem': (e) => e.getParent()?.removeChild(e),
        'inputs.refresh': () => inputsProvider.refresh(),
        'inputs.addFile': () => inputsProvider.inputsViewItem.addFile(),
        'inputs.addInput': (e) => e.addInput(),
        'inputs.renameInput': (e) => e.rename(),
        'inputs.addLine': (e) => e.addLine(),
    };
    for (const [id, handler] of Object.entries(handlers)) {
        context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.EXTENSION_ID}-${id}`, handler));
    }
}
function deactivate() {
}
//# sourceMappingURL=extension.js.map