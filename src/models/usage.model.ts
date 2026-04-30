import { Schema, model, Document, Types } from 'mongoose';

interface UsageCategory {
  category: string;
  percentage: number;
  color: string;
}

export interface IUsage extends Document {
  userId: Types.ObjectId;
  period: string; // e.g. '2026-03'
  totalDataUsed: number;
  totalCallMinutes: number;
  totalSmsSent: number;
  totalCost: number;
  planId: string;
  usageByCategory: UsageCategory[];
  dataBurnRate: 'Low' | 'Medium' | 'High';
  projectedOverage: {
    data: number;
    cost: number;
  };
}

const UsageCategorySchema = new Schema<UsageCategory>({
  category: { type: String, required: true },
  percentage: { type: Number, required: true },
  color: { type: String, required: true },
}, { _id: false });

const UsageSchema = new Schema<IUsage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true }, // Format: YYYY-MM
  totalDataUsed: { type: Number, default: 0 },
  totalCallMinutes: { type: Number, default: 0 },
  totalSmsSent: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  planId: { type: String, required: true },
  usageByCategory: [UsageCategorySchema],
  dataBurnRate: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  projectedOverage: {
    data: { type: Number, default: 0 },
    cost: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Ensure one usage record per user per period
UsageSchema.index({ userId: 1, period: 1 }, { unique: true });

export default model<IUsage>('Usage', UsageSchema);
