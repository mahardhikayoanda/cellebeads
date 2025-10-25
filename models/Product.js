import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true }, // URL ke gambar (kita akan bahas upload nanti)
}, { timestamps: true });

export default models.Product || model('Product', ProductSchema);