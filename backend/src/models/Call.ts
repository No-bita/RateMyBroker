import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTIONS } from '../config/constants';

export interface ICall extends Document {
  stock: string;
  broker: string;
  creator: mongoose.Types.ObjectId;
  action: 'BUY' | 'SELL';
  status: 'ACTIVE' | 'TARGET HIT' | 'STOP LOSS HIT' | 'PENDING VERIFICATION' | 'APPROVED' | 'REJECTED';
  target: number;
  stopLoss: number;
  entryDate: string;
  expiryDate: string;
  currentPrice: number;
  rationale: string;
  riskReward: string;
  tags: string[];
  priceHistory: number[];
  outcomeHistory: Array<{ date: string; status: string }>;
  news: Array<{ title: string; url: string }>;
  comments: Array<{ user: string; text: string }>;
  attachments: Array<{ name: string; url: string }>;
}

const callSchema = new Schema<ICall>({
  stock: { type: String, required: true },
  broker: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['BUY', 'SELL'], required: true },
  status: { type: String, enum: ['ACTIVE', 'TARGET HIT', 'STOP LOSS HIT', 'PENDING VERIFICATION', 'APPROVED', 'REJECTED'], default: 'PENDING VERIFICATION' },
  target: { type: Number, required: true },
  stopLoss: { type: Number, required: true },
  entryDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  rationale: { type: String },
  riskReward: { type: String },
  tags: [{ type: String }],
  priceHistory: [{ type: Number }],
  outcomeHistory: [{ date: String, status: String }],
  news: [{ title: String, url: String }],
  comments: [{ user: String, text: String }],
  attachments: [{ name: String, url: String }],
}, {
  timestamps: true,
  collection: COLLECTIONS.CALLS,
});

export const Call = mongoose.model<ICall>('Call', callSchema); 