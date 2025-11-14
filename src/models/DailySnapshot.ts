import { Schema, model, Document, Types } from "mongoose";

export interface IDailySnapshot extends Document {
  userId: Types.ObjectId;
  date: Date;
  totalInvestment: number;
  totalCurrentValue: number;
  totalUnrealizedPnL: number;
  positions: any[];
  createdAt: Date;
  updatedAt: Date;
}

const DailySnapshotSchema = new Schema<IDailySnapshot>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    totalInvestment: { type: Number, required: true },
    totalCurrentValue: { type: Number, required: true },
    totalUnrealizedPnL: { type: Number, required: true },
    positions: {
      type: [{ 
        positionId: { type: Schema.Types.ObjectId, ref: "Position" },
        companyName: String,
        quantity: Number,
        currentPrice: Number,
        currentValue: Number,
        unrealizedPnL: Number,
      }],
      required: true,
    },
  },
  { timestamps: true }
);

DailySnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailySnapshot = model<IDailySnapshot>("DailySnapshot", DailySnapshotSchema);
