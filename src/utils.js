"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = getId;
function getId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
}
//# sourceMappingURL=utils.js.map