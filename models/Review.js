import mongoose, { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- TAMBAHAN BARU ---
  // Ini menghubungkan ulasan ke pesanan spesifik
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true }, 
  // --------------------

  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  image: { type: String, required: false }, // Foto ulasan (opsional)
}, { timestamps: true });

// Hapus cache model lama
if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.Review) delete mongoose.models.Review;
}

export default mongoose.models.Review || model('Review', ReviewSchema);