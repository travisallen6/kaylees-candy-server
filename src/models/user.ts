import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  created: Date;
  updated: Date;
  firstName: string;
  lastName: string;
  phone?: String;
  id: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  id: { type: String, index: true },
}, { timestamps: true });

const User = mongoose.model<IUser>('user', userSchema);

export default User
