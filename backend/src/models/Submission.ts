import mongoose, { Schema, Document } from 'mongoose';

export enum SubmissionType {
  PROPOSAL = 'proposal',
  PID = 'pid',
  INTERIM_REPORT = 'interim_report',
  RESEARCH_ABSTRACT = 'research_abstract',
  POSTER = 'poster',
  FINAL_REPORT = 'final_report'
}

export enum SubmissionVersion {
  V1 = 'v1',
  V2 = 'v2',
  FINAL = 'final'
}

export interface ISubmission extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: SubmissionType;
  fileUrl: string;
  version: SubmissionVersion;
  originalFilename: string;
  grade: number;
  feedback: string;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(SubmissionType), required: true },
    fileUrl: { type: String, required: true },
    version: {
      type: String,
      enum: Object.values(SubmissionVersion),
      default: SubmissionVersion.V1
    },
    originalFilename: { type: String, required: true },
    grade: { type: Number, default: 0, min: 0, max: 100 },
    feedback: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
