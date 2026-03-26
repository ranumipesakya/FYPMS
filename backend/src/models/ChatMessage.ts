import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  projectId: mongoose.Types.ObjectId;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }
}, { timestamps: true });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
