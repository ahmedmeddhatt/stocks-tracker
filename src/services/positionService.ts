import { Position } from "../models/Position";
import { Transaction } from "../models/Transaction";

export async function recomputePosition(positionId: string) {
  const txs = await Transaction.find({ positionId });
  let totalQty = 0;
  let totalInvest = 0;
  let totalFees = 0;
  let buyQty = 0;
  let weightedSum = 0;

  for (const t of txs) {
    if (t.type === "buy") {
      totalQty += t.quantity;
      totalInvest += (t.price ?? 0) * t.quantity;
      totalFees += t.fees ?? 0;
      buyQty += t.quantity;
      weightedSum += (t.price ?? 0) * t.quantity;
    } else if (t.type === "sell") {
      totalQty -= t.quantity; // simple approach
    } else {
      totalFees += t.fees ?? 0;
    }
  }

  const avgPrice = buyQty > 0 ? weightedSum / buyQty : 0;
  const investmentWithFees = totalInvest + totalFees;

  const pos = await Position.findById(positionId);
  if (!pos) throw new Error("Position not found");

  pos.totalQuantity = totalQty;
  pos.avgPurchasePrice = avgPrice;
  pos.totalInvestment = totalInvest;
  pos.totalFees = totalFees;
  pos.investmentWithFees = investmentWithFees;

  if (pos.currentPrice != null) {
    pos.currentValue = (pos.currentPrice ?? 0) * totalQty;
    pos.unrealizedPnL = (pos.currentValue ?? 0) - investmentWithFees;
    pos.unrealizedPct =
      investmentWithFees !== 0
        ? (pos.unrealizedPnL! / investmentWithFees) * 100
        : 0;
  } else {
    pos.currentValue = undefined;
    pos.unrealizedPnL = undefined;
    pos.unrealizedPct = undefined;
  }

  await pos.save();
  return pos;
}
