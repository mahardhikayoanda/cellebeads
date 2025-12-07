// File: models/Product.js
import mongoose, { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true }, 
  
  // --- PERUBAHAN DI SINI: Tambahkan kategori baru ke enum ---
  category: { 
    type: String, 
    required: true, 
    enum: ['Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'] 
  },
  // ----------------------------------------------------------
  
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models && mongoose.models.Product) {
    delete mongoose.models.Product;
  }
}

const Product = (mongoose.models && mongoose.models.Product) || model('Product', ProductSchema);
export default Product;