"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
const mongoose_1 = require("mongoose");
const PositionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    totalQuantity: { type: Number, default: 0 },
    avgPurchasePrice: { type: Number, default: 0 },
    totalInvestment: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 },
    investmentWithFees: { type: Number, default: 0 },
    currentPrice: { type: Number },
    currentValue: { type: Number },
    unrealizedPnL: { type: Number },
    unrealizedPct: { type: Number },
    status: {
        type: String,
        enum: ["holding", "sold", "watching"],
        default: "holding",
    },
}, { timestamps: true });
exports.Position = (0, mongoose_1.model)("Position", PositionSchema);
