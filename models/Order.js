import { Schema, model, models } from 'mongoose';

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
  isPaid: { type: Boolean, default: false }, // Admin bisa set ini manual
  deliveredAt: { type: Date },
}, { timestamps: true });

export default models.Order || model('Order', OrderSchema);