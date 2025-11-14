"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = getTransactions;
exports.getTransactionById = getTransactionById;
exports.createTransaction = createTransaction;
exports.deleteTransaction = deleteTransaction;
const Transaction_1 = require("../models/Transaction");
const Position_1 = require("../models/Position");
const positionService_1 = require("../services/positionService");
// Get all transactions for user or a specific position
async function getTransactions(req, res) {
    try {
        const user = req.user;
        const filter = { userId: user._id };
        if (req.query.positionId)
            filter.positionId = req.query.positionId;
        const transactions = await Transaction_1.Transaction.find(filter);
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Get single transaction
async function getTransactionById(req, res) {
    try {
        const user = req.user;
        const txn = await Transaction_1.Transaction.findOne({ _id: req.params.id, userId: user._id });
        if (!txn)
            return res.status(404).json({ error: "Transaction not found" });
        res.json(txn);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Create transaction and update related position totals
async function createTransaction(req, res) {
    try {
        const user = req.user;
        const { positionId, quantity, price, fees, type } = req.body;
        const position = await Position_1.Position.findOne({ _id: positionId, userId: user._id });
        if (!position)
            return res.status(404).json({ error: "Position not found" });
        const txn = await Transaction_1.Transaction.create({
            userId: user._id,
            positionId,
            quantity,
            price,
            fees: fees || 0,
            type: type || "buy",
            total: quantity * price + (fees || 0),
        });
        // Recompute the position after this transaction
        const updatedPosition = await (0, positionService_1.recomputePosition)(position._id.toString());
        res.status(201).json({ transaction: txn, position: updatedPosition });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Delete transaction and recompute position
async function deleteTransaction(req, res) {
    try {
        const user = req.user;
        const txn = await Transaction_1.Transaction.findOne({ _id: req.params.id, userId: user._id });
        if (!txn)
            return res.status(404).json({ error: "Transaction not found" });
        await txn.deleteOne(); // delete after retrieving
        // now TypeScript knows txn.positionId exists
        await (0, positionService_1.recomputePosition)(txn.positionId.toString());
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
