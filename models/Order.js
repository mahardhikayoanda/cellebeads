// File: models/Order.js
import mongoose, { Schema, model } from 'mongoose'; // <-- PERBAIKAN IMPORT

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  totalPrice: { type: Number, required: true },
  shippingDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'transfer'], required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid: { type: Boolean, default: false }, 
  deliveredAt: { type: Date },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  if (mongoose.models.Order) delete mongoose.models.Order; // Gunakan mongoose.models
}

export default mongoose.models.Order || model('Order', OrderSchema); // Gunakan mongoose.models