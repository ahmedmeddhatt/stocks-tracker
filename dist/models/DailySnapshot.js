"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailySnapshot = void 0;
const mongoose_1 = require("mongoose");
const DailySnapshotSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    totalInvestment: { type: Number, required: true },
    totalCurrentValue: { type: Number, required: true },
    totalUnrealizedPnL: { type: Number, required: true },
    positions: {
        type: [{
                positionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Position" },
                companyName: String,
                quantity: Number,
                currentPrice: Number,
                currentValue: Number,
                unrealizedPnL: Number,
            }],
        required: true,
    },
}, { timestamps: true });
DailySnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });
exports.DailySnapshot = (0, mongoose_1.model)("DailySnapshot", DailySnapshotSchema);
