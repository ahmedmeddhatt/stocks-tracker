import { Request, Response } from "express";
import { Position } from "../models/Position";
import { DailySnapshot } from "../models/DailySnapshot";
import { createDailySnapshot } from "../services/snapshotService";
import { recomputePosition } from "../services/positionService";

// Portfolio summary
export async function getSummary(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const positions = await Position.find({ userId: user._id });

    // Recompute all positions before aggregating
    for (const pos of positions) {
      await recomputePosition(pos._id.toString());
    }

    const updatedPositions = await Position.find({ userId: user._id });

    const totalInvestment = updatedPositions.reduce((sum, p) => sum + (p.investmentWithFees ?? 0), 0);
    const totalCurrentValue = updatedPositions.reduce((sum, p) => sum + (p.currentValue ?? 0), 0);
    const totalUnrealizedPnL = totalCurrentValue - totalInvestment;
    const totalPercent = totalInvestment ? parseFloat(((totalUnrealizedPnL / totalInvestment) * 100).toFixed(2)) : 0;
    res.json({
      count: updatedPositions.length,
      totalInvestment,
      totalCurrentValue,
      totalUnrealizedPnL,
      totalPercent,
      positions: updatedPositions,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Analytics per company
export async function getCompanyAnalytics(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    // Normalize input → safe lowercase handling
    const rawName = req.params.companyName || "";
    const companyNameParam = rawName.trim().toLowerCase();

    // Case-insensitive search in DB
    const positions = await Position.find({
      userId: user._id,
      companyName: { $regex: new RegExp(`^${companyNameParam}$`, "i") }
    });

    if (!positions.length) {
      return res.status(404).json({ error: "No positions found for this company" });
    }

    // Recompute all positions
    for (const pos of positions) {
      await recomputePosition(pos._id.toString());
    }

    // Fetch updated data
    const updatedPositions = await Position.find({
      userId: user._id,
      companyName: { $regex: new RegExp(`^${companyNameParam}$`, "i") }
    });

    const totalInvestment = updatedPositions.reduce(
      (sum, p) => sum + (p.investmentWithFees ?? 0),
      0
    );

    const totalCurrentValue = updatedPositions.reduce(
      (sum, p) => sum + (p.currentValue ?? 0),
      0
    );

    const gainLoss = totalCurrentValue - totalInvestment;
    const percent = totalInvestment ? (gainLoss / totalInvestment) * 100 : 0;

    res.json({
      companyName: rawName,
      positions: updatedPositions,
      totalInvestment,
      totalCurrentValue,
      gainLoss,
      percent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


// Get historical daily snapshots
export async function getSnapshots(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const snapshots = await DailySnapshot.find({ userId: user._id }).sort({ date: -1 }).limit(90);
    res.json(snapshots);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Force-create snapshot for a specific day
export async function createSnapshot(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { date } = req.query;

    const snapshot = await createDailySnapshot(
      user._id,
      date ? new Date(String(date)) : undefined,
    );

    res.status(201).json(snapshot);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

