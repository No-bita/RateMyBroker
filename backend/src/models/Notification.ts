import mongoose, { Document, Schema } from 'mongoose';
import { COLLECTIONS } from '../config/constants';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'CALL_STATUS';
  message: string;
  callId: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CALL_STATUS'], required: true },
  message: { type: String, required: true },
  callId: { type: Schema.Types.ObjectId, ref: 'Call', required: true },
  read: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: COLLECTIONS.NOTIFICATIONS,
});

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 