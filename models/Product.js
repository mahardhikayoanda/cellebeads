// File: models/Product.js
import mongoose, { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
  // --- UPDATE: Harga dasar jadi default 0 (tidak wajib diisi manual jika ada displayPrice) ---
  price: { type: Number, default: 0 }, 
  
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true }, 
  category: { 
    type: String, 
    required: true, 
    enum: ['Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik', 'Request'] 
  },
  
  models: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  
  displayPrice: { type: String }, // Menyimpan teks rentang harga

}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models && mongoose.models.Product) {
    delete mongoose.models.Product;
  }
}

const Product = (mongoose.models && mongoose.models.Product) || model('Product', ProductSchema);
export default Product;