import mongoose from 'mongoose';

const categories = [
  'عرض الصواني', 'ميني صواني', 'الطواجن', 'الكيس الحراري', 
  'وجبات', 'الشوربة', 'الباستا', 'الارز', 
  'السندوتشات', 'مقبلات', 'السلطات والصوصات', 'مشروبات'
];

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: categories, required: true },
  image: { type: String },
  country: { type: String, enum: ['مصر', 'السعودية SA'], required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
