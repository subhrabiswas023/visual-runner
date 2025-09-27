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
exports.FileItem = void 0;
const vscode = __importStar(require("vscode"));
const utils_1 = require("../../utils");
const TreeItem_1 = require("../TreeItem");
const InputItem_1 = require("./InputItem");
class FileItem extends TreeItem_1.TreeItem {
    refreshCallback;
    constructor(resourceUri, refreshCallback) {
        super(resourceUri, vscode.TreeItemCollapsibleState.Expanded, (0, utils_1.getId)(), refreshCallback);
        this.refreshCallback = refreshCallback;
        this.contextValue = 'file';
        this.iconPath = vscode.ThemeIcon.File;
    }
    // TODO: put this in {@link utils.js} file as an algorithm 
    getDefaultLabel() {
        const inputItems = this._children;
        const indices = inputItems
            .map((input) => input.label?.toString().match(/^Input (\d+)$/))
            .filter((match) => match !== null)
            .map((match) => parseInt(match[1]));
        const nextIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;
        return `Input ${nextIndex}`;
    }
    addInput() {
        const label = this.getDefaultLabel();
        const inputItem = new InputItem_1.InputItem(label, this.refreshCallback);
        this.addChild(inputItem);
    }
}
exports.FileItem = FileItem;
//# sourceMappingURL=FileItem.js.map