"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDailySnapshot = createDailySnapshot;
const DailySnapshot_1 = require("../models/DailySnapshot");
const Position_1 = require("../models/Position");
async function createDailySnapshot(date) {
    const snapshotDate = date
        ? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
        : new Date();
    const positions = await Position_1.Position.find();
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let totalUnrealizedPnL = 0;
    const posSummaries = [];
    for (const p of positions) {
        const inv = p.investmentWithFees ?? 0;
        const cur = p.currentValue ??
            (p.currentPrice != null ? p.currentPrice * p.totalQuantity : 0);
        const upnl = (cur ?? 0) - inv;
        totalInvestment += inv;
        totalCurrentValue += cur ?? 0;
        totalUnrealizedPnL += upnl ?? 0;
        posSummaries.push({
            positionId: p._id,
            companyName: p.companyName,
            quantity: p.totalQuantity,
            currentPrice: p.currentPrice,
            currentValue: cur,
            unrealizedPnL: upnl,
        });
    }
    const snap = await DailySnapshot_1.DailySnapshot.create({
        date: snapshotDate,
        totalInvestment,
        totalCurrentValue,
        totalUnrealizedPnL,
        positions: posSummaries,
    });
    return snap;
}
