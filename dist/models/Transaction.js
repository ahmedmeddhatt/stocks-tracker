"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const TransactionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    positionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Position", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    type: { type: String, enum: ["buy", "sell"], default: "buy" },
    total: { type: Number, required: true },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
