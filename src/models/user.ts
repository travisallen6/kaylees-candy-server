import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  created: Date;
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
  id: { type: String, index: true },
}, { timestamps: true });

const User = mongoose.model<IUser>('user', userSchema);

export default User
