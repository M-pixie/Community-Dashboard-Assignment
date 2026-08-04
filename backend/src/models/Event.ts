import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  date: Date; // Kept for backward compatibility, represents start date
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  venue?: string;
  onlineMeetingLink?: string;
  organizer?: mongoose.Types.ObjectId;
  maxSeats?: number;
  registrationDeadline?: Date;
  status: 'Upcoming' | 'Ongoing' | 'Past' | 'Cancelled' | 'Draft';
  visibility: 'Public' | 'Private';
  tags?: string[];
  bannerImage?: string;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, trim: true },
  description: { type: String }, // Rich text
  category: { type: String, default: 'General' },
  date: { type: Date, required: true },
  endDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  venue: { type: String },
  onlineMeetingLink: { type: String },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  maxSeats: { type: Number, default: 0 }, // 0 means unlimited
  registrationDeadline: { type: Date },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Past', 'Cancelled', 'Draft'], 
    default: 'Upcoming' 
  },
  visibility: { 
    type: String, 
    enum: ['Public', 'Private'], 
    default: 'Public' 
  },
  tags: [{ type: String }],
  bannerImage: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Optional: Pre-save hook to automatically update status based on date if not Draft/Cancelled
EventSchema.pre('save', function() {
  if (this.status !== 'Draft' && this.status !== 'Cancelled') {
    const now = new Date();
    if (this.endDate && now > this.endDate) {
      this.status = 'Past';
    } else if (!this.endDate && this.date && now > this.date) {
      // If no end date, we just say it's past if the start date has passed significantly?
      // Actually, let's keep it simple.
      this.status = 'Past';
    } else if (this.date && now >= this.date && (!this.endDate || now <= this.endDate)) {
      this.status = 'Ongoing';
    } else {
      this.status = 'Upcoming';
    }
  }
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
