"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPositions = getAllPositions;
exports.getPositionById = getPositionById;
exports.createPosition = createPosition;
exports.updatePosition = updatePosition;
exports.deletePosition = deletePosition;
const Position_1 = require("../models/Position");
const positionService_1 = require("../services/positionService");
// Get all positions for the authenticated user
async function getAllPositions(req, res) {
    try {
        const user = req.user;
        const positions = await Position_1.Position.find({ userId: user._id });
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Get one position and recompute it first
async function getPositionById(req, res) {
    try {
        const user = req.user;
        const position = await Position_1.Position.findOne({ _id: req.params.id, userId: user._id });
        if (!position)
            return res.status(404).json({ error: "Position not found" });
        // Recompute metrics before returning
        const updatedPosition = await (0, positionService_1.recomputePosition)(position._id.toString());
        res.json(updatedPosition);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Create a new position
async function createPosition(req, res) {
    try {
        const user = req.user;
        const data = req.body;
        const newPosition = await Position_1.Position.create({
            ...data,
            userId: user._id,
            totalQuantity: 0,
            avgPurchasePrice: 0,
            totalInvestment: 0,
            totalFees: 0,
            investmentWithFees: 0,
            currentValue: 0,
            unrealizedPnL: 0,
            unrealizedPct: 0,
        });
        res.status(201).json(newPosition);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Update position
async function updatePosition(req, res) {
    try {
        const user = req.user;
        const data = req.body;
        const position = await Position_1.Position.findOne({ _id: req.params.id, userId: user._id });
        if (!position)
            return res.status(404).json({ error: "Position not found" });
        Object.assign(position, data);
        await position.save();
        // Recompute after update
        const updatedPosition = await (0, positionService_1.recomputePosition)(position._id.toString());
        res.json(updatedPosition);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Delete position
async function deletePosition(req, res) {
    try {
        const user = req.user;
        const deleted = await Position_1.Position.findOneAndDelete({ _id: req.params.id, userId: user._id });
        if (!deleted)
            return res.status(404).json({ error: "Position not found" });
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
