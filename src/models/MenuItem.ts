import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  country: { type: String, enum: ['مصر', 'السعودية SA', 'الإمارات AE'], required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
