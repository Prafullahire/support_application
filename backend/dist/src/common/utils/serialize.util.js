"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJsonValue = toJsonValue;
const library_1 = require("@prisma/client/runtime/library");
function toJsonValue(value) {
    if (value === null || value === undefined)
        return value;
    if (value instanceof library_1.Decimal)
        return value.toNumber();
    if (value instanceof Date)
        return value.toISOString();
    if (Array.isArray(value))
        return value.map(toJsonValue);
    if (typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, toJsonValue(val)]));
    }
    return value;
}
//# sourceMappingURL=serialize.util.js.map