"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const energieSchema = new mongoose_1.default.Schema({
    year: { type: Number, default: 2024, required: true },
    month: { type: Number },
    date: { type: String, default: new Date(), required: true },
    energie: { type: String, default: "00.00:000", required: true },
    time: { type: String, default: "00", required: true },
    message: { type: String, default: "00.00:000.00:00:00", required: true },
}, { timestamps: true });
const Energies = mongoose_1.default.model("energie", energieSchema);
exports.default = Energies;
//# sourceMappingURL=energie.model.js.map