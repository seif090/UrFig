import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  savedDesigns: any[];
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  savedDesigns: [{
    name: String,
    head: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    torso: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    legs: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    accessory: { type: Schema.Types.ObjectId, ref: 'LegoPart' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password || '');
};

export const User = model<IUser>('User', UserSchema);
迫