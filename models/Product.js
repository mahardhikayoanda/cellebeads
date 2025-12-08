// File: models/Product.js
import mongoose, { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Harga dasar / fallback
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true }, 
  category: { 
    type: String, 
    required: true, 
    // Menambahkan 'Request' ke dalam enum
    enum: ['Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik', 'Request'] 
  },
  
  // --- VARIAN MODEL (Nama & Harga) ---
  models: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  
  // --- TEKS RENTANG HARGA (Opsional, untuk tampilan katalog) ---
  displayPrice: { type: String }, 

}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models && mongoose.models.Product) {
    delete mongoose.models.Product;
  }
}

const Product = (mongoose.models && mongoose.models.Product) || model('Product', ProductSchema);
export default Product;