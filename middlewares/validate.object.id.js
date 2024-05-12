"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_handler_1 = __importDefault(require("../utils/error.handler"));
const validateObjectId = async (req, res, next) => {
    if (!mongoose_1.default.isValidObjectId(req.params.id))
        return res.status(400).json(new error_handler_1.default(400, "invalid id"));
    next();
};
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=validate.object.id.js.map