import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
  id: string; // custom string id, e.g., 'pulse-flexi'
  name: string;
  category: string;
  monthlyCost: number;
  dataGB: number;
  callMinutes: number;
  smsCount: number;
  validityDays: number;
  activationCode: string;
  summary: string;
  features: string[];
  bestFor: string;
  limitations: string;
  competitors: string[];
  upsellTo: string | null;
  matchScore?: number;
}

const PlanSchema = new Schema<IPlan>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  monthlyCost: { type: Number, required: true },
  dataGB: { type: Number, required: true },
  callMinutes: { type: Number, required: true },
  smsCount: { type: Number, required: true },
  validityDays: { type: Number, required: true },
  activationCode: { type: String, required: true },
  summary: { type: String, required: true },
  features: [{ type: String }],
  bestFor: { type: String, required: true },
  limitations: { type: String, required: true },
  competitors: [{ type: String }],
  upsellTo: { type: String, default: null },
  matchScore: { type: Number, default: 0 },
});

export default model<IPlan>('Plan', PlanSchema);
