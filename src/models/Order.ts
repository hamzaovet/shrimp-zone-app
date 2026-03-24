import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    id: String,
    title: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  country: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
