"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidQueryValue = isValidQueryValue;
exports.parseOptionalDate = parseOptionalDate;
exports.buildExpenseDateFilter = buildExpenseDateFilter;
function isValidQueryValue(value) {
    if (!value)
        return false;
    const normalized = value.trim().toLowerCase();
    return normalized !== 'undefined' && normalized !== 'null';
}
function parseOptionalDate(value) {
    if (!isValidQueryValue(value))
        return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}
function buildExpenseDateFilter(startDate, endDate) {
    const gte = parseOptionalDate(startDate);
    const lte = parseOptionalDate(endDate);
    if (!gte && !lte)
        return {};
    return {
        expenseDate: {
            ...(gte ? { gte } : {}),
            ...(lte ? { lte } : {}),
        },
    };
}
//# sourceMappingURL=query.util.js.map