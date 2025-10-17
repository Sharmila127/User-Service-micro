import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
