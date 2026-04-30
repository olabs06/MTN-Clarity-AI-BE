import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  userId: Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  messages: [ChatMessageSchema],
}, { timestamps: true });

export default model<IChatSession>('ChatSession', ChatSessionSchema);
