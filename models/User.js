// File: models/User.js
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  image: { type: String }, 
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  },
  phone: { type: String },
  gender: { type: String, enum: ['Pria', 'Wanita'] },
  dateOfBirth: { type: Date },
  bio: { type: String },
  address: { type: String },
  authProvider: { type: String, default: 'credentials' }, 
  profileComplete: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date } 
}, { timestamps: true, strict: false }); // [MODIFIED] Strict false untuk memastikan fields baru bisa disimpan

// Hash password sebelum save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; 
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- BAGIAN ANTI-CRASH (PENTING) ---
// Mencegah model dicompile ulang saat hot-reload yang bikin server crash
const User = mongoose.models?.User || model('User', UserSchema);

export default User;