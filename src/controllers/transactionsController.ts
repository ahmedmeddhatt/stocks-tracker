import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { Position } from "../models/Position";
import { recomputePosition } from "../services/positionService";

// Get all transactions for user or a specific position
export async function getTransactions(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const filter: any = { userId: user._id };
    if (req.query.positionId) filter.positionId = req.query.positionId;
    const transactions = await Transaction.find(filter);
    res.json({Count: transactions.length, transactions});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Get single transaction
export async function getTransactionById(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const txn = await Transaction.findOne({ _id: req.params.id, userId: user._id });
    if (!txn) return res.status(404).json({ error: "Transaction not found" });
    res.json(txn);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Create transaction and update related position totals
export async function createTransaction(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { positionId, quantity, price, fees, type } = req.body;

    const position = await Position.findOne({ _id: positionId, userId: user._id });
    if (!position) return res.status(404).json({ error: "Position not found" });

    const txn = await Transaction.create({
      userId: user._id,
      positionId,
      quantity,
      price,
      fees: fees || 0,
      type: type || "buy",
      total: quantity * price + (fees || 0),
    });

    // Recompute the position after this transaction
    const updatedPosition = await recomputePosition(position._id.toString());

    res.status(201).json({ transaction: txn, position: updatedPosition });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Delete transaction and recompute position
export async function deleteTransaction(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const txn = await Transaction.findOne({ _id: req.params.id, userId: user._id });
    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    await txn.deleteOne(); // delete after retrieving

    // now TypeScript knows txn.positionId exists
    await recomputePosition(txn.positionId.toString());


    res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
