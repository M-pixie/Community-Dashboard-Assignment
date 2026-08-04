import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'Post' | 'Comment' | 'Reaction' | 'Login' | 'Event_RSVP';
  description: string;
  timestamp: Date;
}

const ActivitySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['Post', 'Comment', 'Reaction', 'Login', 'Event_RSVP'], 
    required: true 
  },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
