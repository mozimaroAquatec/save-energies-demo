"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidYear = void 0;
// Define a custom validation function for a valid year
const isValidYear = (year) => {
    // Check if the value is a valid number and within a reasonable range
    if (typeof year !== "number" || year >= new Date().getFullYear()) {
        return true;
    }
    else
        return false;
};
exports.isValidYear = isValidYear;
//# sourceMappingURL=year-validation.js.map