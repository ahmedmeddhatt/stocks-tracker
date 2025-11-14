import { DailySnapshot } from "../models/DailySnapshot";
import { Position } from "../models/Position";

export async function createDailySnapshot(userId: string, date?: Date) {
  const snapshotDate = date
    ? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    : new Date();

  const positions = await Position.find({ userId });

  let totalInvestment = 0;
  let totalCurrentValue = 0;
  let totalUnrealizedPnL = 0;

  const posSummaries: any[] = [];

  for (const p of positions) {
    const inv = p.investmentWithFees ?? 0;
    const cur =
      p.currentValue ??
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

  const snap = await DailySnapshot.create({
    userId,                     // ✅ REQUIRED
    date: snapshotDate,
    totalInvestment,
    totalCurrentValue,
    totalUnrealizedPnL,
    positions: posSummaries,
  });

  return snap;
}
