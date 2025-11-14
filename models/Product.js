// File: models/Product.js
import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: { type: [String], required: true }, 
  // TAMBAHAN BARU: Kategori
  category: { 
    type: String, 
    required: true, 
    enum: ['Gelang', 'Kalung', 'Cincin', 'Keychain'] // Pilihan terbatas agar konsisten
  },
}, { timestamps: true });

// Hapus model cache agar perubahan terbaca
if (process.env.NODE_ENV === 'development') {
  if (models.Product) delete models.Product;
}

export default models.Product || model('Product', ProductSchema);