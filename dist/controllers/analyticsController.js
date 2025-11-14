"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
exports.getCompanyAnalytics = getCompanyAnalytics;
exports.getSnapshots = getSnapshots;
exports.createSnapshot = createSnapshot;
const Position_1 = require("../models/Position");
const DailySnapshot_1 = require("../models/DailySnapshot");
const snapshotService_1 = require("../services/snapshotService");
const positionService_1 = require("../services/positionService");
// Portfolio summary
async function getSummary(req, res) {
    try {
        const user = req.user;
        const positions = await Position_1.Position.find({ userId: user._id });
        // Recompute all positions before aggregating
        for (const pos of positions) {
            await (0, positionService_1.recomputePosition)(pos._id.toString());
        }
        const updatedPositions = await Position_1.Position.find({ userId: user._id });
        const totalInvestment = updatedPositions.reduce((sum, p) => sum + (p.investmentWithFees ?? 0), 0);
        const totalCurrentValue = updatedPositions.reduce((sum, p) => sum + (p.currentValue ?? 0), 0);
        const totalUnrealizedPnL = totalCurrentValue - totalInvestment;
        const totalPercent = totalInvestment ? (totalUnrealizedPnL / totalInvestment) * 100 : 0;
        res.json({
            totalInvestment,
            totalCurrentValue,
            totalUnrealizedPnL,
            totalPercent,
            count: updatedPositions.length,
            positions: updatedPositions,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Analytics per company
async function getCompanyAnalytics(req, res) {
    try {
        const user = req.user;
        const { companyName } = req.params;
        const positions = await Position_1.Position.find({ companyName, userId: user._id });
        if (!positions.length)
            return res.status(404).json({ error: "No positions found" });
        // Recompute positions
        for (const pos of positions) {
            await (0, positionService_1.recomputePosition)(pos._id.toString());
        }
        const updatedPositions = await Position_1.Position.find({ companyName, userId: user._id });
        const totalInvestment = updatedPositions.reduce((sum, p) => sum + (p.investmentWithFees ?? 0), 0);
        const totalCurrentValue = updatedPositions.reduce((sum, p) => sum + (p.currentValue ?? 0), 0);
        const gainLoss = totalCurrentValue - totalInvestment;
        const percent = totalInvestment ? (gainLoss / totalInvestment) * 100 : 0;
        res.json({
            companyName,
            positions: updatedPositions,
            totalInvestment,
            totalCurrentValue,
            gainLoss,
            percent,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Get historical daily snapshots
async function getSnapshots(req, res) {
    try {
        const user = req.user;
        const snapshots = await DailySnapshot_1.DailySnapshot.find({ userId: user._id }).sort({ date: -1 }).limit(90);
        res.json(snapshots);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Force-create snapshot for a specific day
async function createSnapshot(req, res) {
    try {
        const user = req.user;
        const { date } = req.query;
        const snapshot = await (0, snapshotService_1.createDailySnapshot)(date ? new Date(String(date)) : undefined);
        res.status(201).json(snapshot);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
