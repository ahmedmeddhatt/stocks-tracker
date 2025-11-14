import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  positionId: Types.ObjectId;
  quantity: number;
  price: number;
  fees?: number;
  type: "buy" | "sell";
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    positionId: { type: Schema.Types.ObjectId, ref: "Position", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    type: { type: String, enum: ["buy", "sell"], default: "buy" },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
