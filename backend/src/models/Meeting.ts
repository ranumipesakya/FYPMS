import mongoose, { Schema, Document } from 'mongoose';

export enum MeetingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

export interface IMeeting extends Document {
  projectId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  supervisorId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  link: string;
  status: MeetingStatus;
  agenda: string;
}

const MeetingSchema = new Schema<IMeeting>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  link: { type: String, default: '' },
  status: { type: String, enum: Object.values(MeetingStatus), default: MeetingStatus.PENDING },
  agenda: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
