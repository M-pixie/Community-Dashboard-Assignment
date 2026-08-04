import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: Date;
  lastLogin: Date;
  engagementScore: number;
  status: 'Active' | 'Inactive';
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  engagementScore: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
