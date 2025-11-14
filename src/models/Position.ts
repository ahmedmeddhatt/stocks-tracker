import { Schema, model, Document, Types } from "mongoose";

export interface IPosition extends Document {
  userId: Types.ObjectId;
  companyName: string;
  totalQuantity: number;
  avgPurchasePrice: number;
  totalInvestment: number;
  totalFees: number;
  investmentWithFees: number;
  currentPrice?: number;
  currentValue?: number;
  unrealizedPnL?: number;
  unrealizedPct?: number;
  status: "holding" | "sold" | "watching";
  createdAt: Date;
  updatedAt: Date;
}

const PositionSchema = new Schema<IPosition>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    totalQuantity: { type: Number, default: 0 },
    avgPurchasePrice: { type: Number, default: 0 },
    totalInvestment: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 },
    investmentWithFees: { type: Number, default: 0 },
    currentPrice: { type: Number },
    currentValue: { type: Number },
    unrealizedPnL: { type: Number },
    unrealizedPct: { type: Number },
    status: {
      type: String,
      enum: ["holding", "sold", "watching"],
      default: "holding",
    },
  },
  { timestamps: true }
);

export const Position = model<IPosition>("Position", PositionSchema);
