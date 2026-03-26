import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  studentNumber?: string;
  password?: string;
  role: 'student' | 'supervisor' | 'admin';
  avatar?: string;
  assignedSupervisor?: mongoose.Types.ObjectId; 
  assignedStudents?: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/nsbm\.ac\.lk$/, 'Please use a valid institution email']
  },
  studentNumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'supervisor', 'admin'], default: 'student' },
  avatar: { type: String },
  assignedSupervisor: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

UserSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (this: any, password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
