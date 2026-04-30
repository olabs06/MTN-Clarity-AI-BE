import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  currentPlanId?: string;
  monthlySpend?: number;
  dataBurnRate?: 'Low' | 'Medium' | 'High';
  heavySocialUsage?: boolean;
  preferredLanguage?: 'EN' | 'PIDGIN' | 'HA' | 'YO' | 'IG';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, select: false }, // Exclude from queries by default
    currentPlanId: { type: String },
    monthlySpend: { type: Number, default: 0 },
    dataBurnRate: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    heavySocialUsage: { type: Boolean, default: false },
    preferredLanguage: { type: String, enum: ['EN', 'PIDGIN', 'HA', 'YO', 'IG'], default: 'EN' },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', UserSchema);