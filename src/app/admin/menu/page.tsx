"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Plus, Trash2, Edit, Upload, ImageIcon } from "lucide-react";

export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', image: '', country: 'السعودية SA'
  });

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditItemId(null);
    setFormData({ name: '', description: '', price: '', category: '', image: '', country: 'السعودية SA' });
    setUploadError("");
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      country: item.country
    });
    setUploadError("");
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الصنف النهائي؟")) return;
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body }
      );

      if (!res.ok) throw new Error("فشل رفع الصورة. تحقق من مفتاح API.");

      const json = await res.json();
      const url = json?.data?.display_url;

      if (!url) throw new Error("لم يتم العثور على رابط الصورة في الاستجابة.");

      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "حدث خطأ أثناء رفع الصورة.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (editItemId) {
        await fetch(`/api/menu/${editItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchMenu();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrency = (country: string) => {
    if (country === 'السعودية SA') return 'SAR';
    if (country === 'الإمارات AE') return 'AED';
    return 'EGP';
  };

  const getFlag = (country: string) => {
    if (country === 'السعودية SA') return '🇸🇦';
    if (country === 'الإمارات AE') return '🇦🇪';
    return '🇪🇬';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-primary" />
          إدارة المنيو
        </h1>
        <Button onClick={openAddModal} className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:scale-105">
          <Plus className="h-5 w-5" /> إضافة صنف جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-12">جاري التحميل...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12 bg-secondary/20 rounded-2xl border border-white/5 border-dashed">
            لا توجد أصناف في المنيو. اضغط على إضافة لبدء العمل.
          </div>
        ) : (
          items.map(item => (
            <Card key={item._id} className="bg-secondary/40 border-white/10 overflow-hidden hover:border-white/20 transition-colors flex flex-col">
              {item.image && (
                <div className="h-48 w-full bg-white/5 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
                  <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                    {item.price} {getCurrency(item.country)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center text-sm font-medium mt-auto mb-4">
                  <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{item.category}</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    {getFlag(item.country)} {item.country}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-white/10">
                  <div className="flex gap-3 w-full">
                    <Button onClick={() => openEditModal(item)} variant="outline" size="sm" className="flex-1 h-9 border-primary text-primary hover:bg-primary hover:text-white transition-colors bg-primary/5 rounded-lg flex gap-2">
                      <Edit className="h-4 w-4" /> تعديل
                    </Button>
                    <Button onClick={() => handleDelete(item._id)} size="sm" className="flex-1 h-9 bg-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-colors rounded-lg flex gap-2">
                      <Trash2 className="h-4 w-4" /> حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A1128] border border-white/10 w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-white mb-6 animate-in slide-in-from-bottom flex items-center gap-2">
              {editItemId ? <Edit className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
              {editItemId ? "تعديل الصنف" : "إضافة صنف جديد للـ Menu"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-bottom duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">اسم الصنف</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="مثال: جمبري دايناميت" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">السعر</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="0.00" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">القسم (Category)</label>
                  <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="أكياس, مقالي, سلطات..." />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الوصف</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="اكتب تفاصيل أو مكونات الطبق هنا..." />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">صورة الصنف</label>
                <div className="relative">
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-3 w-full bg-white/5 border-2 border-dashed rounded-xl px-4 py-5 cursor-pointer transition-all hover:border-primary/50 hover:bg-white/10 ${
                      isUploading ? 'border-primary/40 animate-pulse' : 'border-white/10'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-primary font-bold text-sm">جاري رفع الصورة...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-400 text-sm">اضغط لاختيار صورة أو اسحبها هنا</span>
                      </>
                    )}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>

                {uploadError && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">⚠️ {uploadError}</p>
                )}

                {formData.image && !isUploading && (
                  <div className="mt-3 relative group">
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={formData.image} alt="معاينة" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold flex items-center gap-1"><ImageIcon className="h-4 w-4" /> تم الرفع بنجاح ✓</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 left-2 bg-destructive/80 hover:bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">الدولة</label>
                <select value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-[#121b36] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  <option value="السعودية SA">🇸🇦 السعودية SA</option>
                  <option value="مصر">🇪🇬 مصر</option>
                  <option value="الإمارات AE">🇦🇪 الإمارات AE</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
                <Button type="button" onClick={() => setModalOpen(false)} variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-xl">إلغاء</Button>
                <Button type="submit" disabled={isSubmitting || isUploading} className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold px-8 rounded-xl h-11 transition-transform hover:scale-[1.02]">
                  {isSubmitting ? "جاري الحفظ..." : (editItemId ? "تحديث الصنف" : "إضافة الصنف")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
