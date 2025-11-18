// File: models/User.js
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  // 1. Password dibuat opsional (tidak wajib)
  password: { type: String, required: false }, 
  
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer',
  },
  
  // --- TAMBAHAN BARU UNTUK BIO DATA ---
  phone: { type: String },
  gender: { type: String, enum: ['Pria', 'Wanita'] },
  
  // Kolom penanda apakah user dari Google atau manual
  authProvider: { type: String, default: 'credentials' }, 
  
  // "KUNCI AJAIB": Penanda apakah profil sudah lengkap
  profileComplete: { type: Boolean, default: false } 
  // ------------------------------------

}, { timestamps: true });

// Hash password HANYA JIKA password diubah (user manual)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; // User Google tidak punya password
  return await bcrypt.compare(enteredPassword, this.password);
};

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.User) delete mongoose.models.User;
}

export default mongoose.models.User || model('User', UserSchema);