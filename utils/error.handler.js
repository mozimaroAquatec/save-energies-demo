"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    status;
    message;
    constructor(status, message) {
        super(message); // Call the parent class's constructor
        this.status = status;
        this.message = message;
    }
}
exports.default = ErrorResponse;
//# sourceMappingURL=error.handler.js.map