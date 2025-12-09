// File: models/Review.js
import mongoose, { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  
  // --- BAGIAN INI YANG KEMUNGKINAN HILANG SEBELUMNYA ---
  image: { 
    type: String, 
    required: false 
  }, 
  // -----------------------------------------------------

  adminReply: {
    type: String,
    required: false
  }
}, { timestamps: true });

// Anti-crash logic untuk development mode (Next.js Hot Reload)
if (process.env.NODE_ENV === 'development') {
  if (mongoose.models && mongoose.models.Review) {
    delete mongoose.models.Review;
  }
}

const Review = (mongoose.models && mongoose.models.Review) || model('Review', ReviewSchema);
export default Review;