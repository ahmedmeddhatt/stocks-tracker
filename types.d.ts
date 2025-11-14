import { Document } from 'mongoose';


export type PositionStatus = 'holding' | 'sold' | 'watch';


export interface IPosition extends Document {
companyName: string;
ticker?: string;
status: PositionStatus;
totalQuantity: number;
avgPurchasePrice: number;
totalInvestment: number;
totalFees: number;
investmentWithFees: number;
currentPrice?: number;
currentValue?: number;
unrealizedPnL?: number;
unrealizedPct?: number;
}


export interface ITransaction extends Document {
positionId: string;
type: 'buy' | 'sell' | 'dividend' | 'fee' | 'other';
pricePerShare?: number;
quantity: number;
fees: number;
executedAt: Date;
notes?: string;
}


export interface IDailySnapshot extends Document {
date: Date;
totalInvestment: number;
totalCurrentValue: number;
totalUnrealizedPnL: number;
positions: any[];
}