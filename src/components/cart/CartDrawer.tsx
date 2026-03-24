"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useCountry } from "@/lib/CountryContext";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANCHES } from "@/lib/branches";

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, setDrawerOpen, updateQuantity, removeFromCart, cartTotal, addToCart } = useCart();
  const { country, isHydrated } = useCountry();
  const [selectedBranch, setSelectedBranch] = useState("");

  if (!isHydrated) return null;

  const currency = country === 'ksa' ? 'SAR' : country === 'uae' ? 'AED' : 'EGP';
  const activeBranches = BRANCHES[country] || [];
  const needsBranchSelection = activeBranches.length > 1;

  const generateWhatsAppMessage = () => {
    let targetPhone = activeBranches[0]?.phone;
    
    if (needsBranchSelection) {
      if (!selectedBranch) {
        alert("الرجاء اختيار الفرع الأقرب إليك لإتمام الطلب");
        return;
      }
      targetPhone = selectedBranch;
    }

    const itemsText = cartItems.map(item => `${item.quantity}x ${item.title} - ${item.price * item.quantity} ${currency}`).join('\n');
    const msg = `مرحباً شرمب زون، أود طلب:\n\n${itemsText}\n\nالإجمالي: ${cartTotal} ${currency}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
  };

  const handleCrossSell = () => {
    if (country === 'ksa') {
      addToCart({ id: 'addon1', title: 'صوص دايناميت', price: 15 });
    } else if (country === 'uae') {
      addToCart({ id: 'addonuae', title: 'مشروب غازي', price: 5 });
    } else {
      addToCart({ id: 'addon2', title: 'طحينة إضافية', price: 20 });
    }
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="left" className="flex flex-col p-0 border-white/10 bg-background">
        <SheetHeader className="p-4 border-b border-white/10">
          <SheetTitle>سلة الطلبات</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-lg">سلتك فارغة حالياً</p>
            </div>
          ) : (
             cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <div className="text-primary font-bold text-sm mt-1">{item.price} {currency}</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/10 rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-300 hover:text-white px-2">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-white text-xs w-4 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-300 hover:text-white px-2">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 transition-colors bg-destructive/10 p-2 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cross Selling Area */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-secondary/30 border-t border-white/10">
            <h4 className="text-sm font-bold text-white mb-3">إضافات سريعة 🔥</h4>
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-white text-sm block">{country === 'ksa' ? 'صوص دايناميت' : country === 'uae' ? 'مشروب غازي' : 'طحينة إضافية'}</span>
                <span className="text-primary text-xs font-bold">{country === 'ksa' ? '15 SAR' : country === 'uae' ? '5 AED' : '20 EGP'}</span>
              </div>
              <Button onClick={handleCrossSell} size="sm" className="bg-primary/20 hover:bg-primary/40 text-primary font-bold rounded-full h-8 px-4">
                <Plus className="h-4 w-4 ml-1" /> إضافة
              </Button>
            </div>
          </div>
        )}

        {/* Checkout Area */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-background pb-safe">
            <div className="flex justify-between items-center mb-5">
              <span className="text-gray-300 font-medium">الإجمالي:</span>
              <span className="text-3xl font-black text-primary">{cartTotal} {currency}</span>
            </div>
            
            {needsBranchSelection && (
              <div className="mb-4">
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full bg-white/5 border-white/20 text-white h-12 rounded-xl text-right" dir="rtl">
                    <SelectValue placeholder="اختر الفرع الأقرب إليك" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeBranches.map(b => (
                      <SelectItem key={b.phone} value={b.phone} className="text-right">{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={generateWhatsAppMessage}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg h-14 rounded-2xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg mb-3"
            >
              <MessageCircle className="h-6 w-6" />
              إتمام الطلب عبر واتساب
            </Button>
            <p className="text-center text-[10px] text-gray-500 font-medium">الأسعار شاملة ضريبة القيمة المضافة. يضاف 12% خدمة داخل الصالة.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
