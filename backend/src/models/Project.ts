import mongoose, { Schema, Document } from 'mongoose';

export enum ProjectStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under-review',
  COMPLETED = 'completed'
}

export enum Milestone {
  PROPOSAL = 'Proposal',
  LIT_REVIEW = 'Literature Review',
  IMPLEMENTATION = 'Implementation',
  TESTING = 'Testing',
  FINAL = 'Final Submission'
}

export interface IProject extends Document {
  title: string;
  description: string;
  studentId: mongoose.Types.ObjectId;
  supervisorId: mongoose.Types.ObjectId;
  status: ProjectStatus;
  progress: number;
  githubLink?: string;
  demoLink?: string;
  currentMilestone: Milestone;
  tags: string[];
  feedback?: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  supervisorId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.PENDING },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  githubLink: { type: String },
  demoLink: { type: String },
  currentMilestone: { type: String, enum: Object.values(Milestone), default: Milestone.PROPOSAL },
  tags: [{ type: String }],
  feedback: { type: String }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
