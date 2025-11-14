import { Request, Response } from "express";
import { Position } from "../models/Position";
import { recomputePosition } from "../services/positionService";

// Get all positions for the authenticated user
export async function getAllPositions(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const positions = await Position.find({ userId: user._id });
    res.json({Count: positions.length, positions});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Get one position and recompute it first
export async function getPositionById(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const position = await Position.findOne({ _id: req.params.id, userId: user._id });
    if (!position) return res.status(404).json({ error: "Position not found" });

    // Recompute metrics before returning
    const updatedPosition = await recomputePosition(position._id.toString());
    res.json(updatedPosition);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Create a new position
export async function createPosition(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const data = req.body;

    const newPosition = await Position.create({
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
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Update position
export async function updatePosition(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const data = req.body;

    const position = await Position.findOne({ _id: req.params.id, userId: user._id });
    if (!position) return res.status(404).json({ error: "Position not found" });

    Object.assign(position, data);
    await position.save();

    // Recompute after update
    const updatedPosition = await recomputePosition(position._id.toString());
    res.json(updatedPosition);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Delete position
export async function deletePosition(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const deleted = await Position.findOneAndDelete({ _id: req.params.id, userId: user._id });
    if (!deleted) return res.status(404).json({ error: "Position not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
