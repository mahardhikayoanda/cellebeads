// File: models/Product.js
import mongoose, { Schema, model } from 'mongoose'; // <-- PERBAIKAN IMPORT

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true }, 
  category: { 
    type: String, 
    required: true, 
    enum: ['Gelang', 'Kalung', 'Cincin', 'Keychain'] 
  },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.Product) delete mongoose.models.Product; // Gunakan mongoose.models
}

export default mongoose.models.Product || model('Product', ProductSchema); // Gunakan mongoose.models