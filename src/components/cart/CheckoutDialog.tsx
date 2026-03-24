"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useCountry } from "@/lib/CountryContext";
import { MessageCircle, User, MapPin, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const COUNTRY_CODES: Record<string, string> = {
  egypt: "+20",
  ksa: "+966",
  uae: "+971",
};

const COUNTRY_DB_MAP: Record<string, string> = {
  egypt: "مصر",
  ksa: "السعودية SA",
  uae: "الإمارات AE",
};

const STORAGE_KEY = "shrimpZoneCustomer";

interface CustomerData {
  name: string;
  address: string;
  phone: string;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPhone: string;
  currency: string;
  branchName?: string;
}

export default function CheckoutDialog({ open, onOpenChange, targetPhone, currency, branchName }: CheckoutDialogProps) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { country } = useCountry();

  const [customer, setCustomer] = useState<CustomerData>({ name: "", address: "", phone: "" });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (open) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as CustomerData;
          setCustomer(parsed);
        }
      } catch {
        // ignore
      }
      setErrors({});
    }
  }, [open]);

  const countryCode = COUNTRY_CODES[country] || "+20";

  const validate = (): boolean => {
    const e: Partial<CustomerData> = {};
    if (!customer.name.trim()) e.name = "الاسم مطلوب";
    if (!customer.address.trim()) e.address = "العنوان مطلوب";
    if (!customer.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSending(true);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));

    const fullPhone = `${countryCode}${customer.phone.replace(/^0+/, "")}`;

    // 1. Save order to DB
    try {
      const orderPayload = {
        customerName: customer.name,
        customerPhone: fullPhone,
        address: customer.address,
        country: COUNTRY_DB_MAP[country] || "مصر",
        branch: branchName || "",
        items: cartItems.map(item => ({
          name: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
      };

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      console.error("Order save error:", err);
      // Continue to WhatsApp even if DB save fails
    }

    // 2. Build WhatsApp invoice
    const itemLines = cartItems
      .map((item) => `- ${item.quantity}x ${item.title} (${item.price * item.quantity} ${currency})`)
      .join("\n");

    const msg = [
      `*طلب جديد من موقع Shrimp Zone* 🦐`,
      `------------------------`,
      `👤 العميل: ${customer.name}`,
      `📞 هاتف: ${fullPhone}`,
      `📍 العنوان: ${customer.address}`,
      `------------------------`,
      `*الطلب:*`,
      itemLines,
      `------------------------`,
      `*الإجمالي:* ${cartTotal} ${currency}`,
    ].join("\n");

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, "_blank");

    // 3. Clear cart & close
    clearCart();
    setIsSending(false);
    onOpenChange(false);
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex flex-col p-0 border-white/10 bg-background w-full sm:max-w-md">
        <SheetHeader className="p-5 border-b border-white/10">
          <SheetTitle className="text-xl">تأكيد الطلب 🦐</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Order Summary */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-white mb-2">ملخص الطلب</h4>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">{item.quantity}x {item.title}</span>
                <span className="text-primary font-bold">{item.price * item.quantity} {currency}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-white/10">
              <span className="text-white font-bold">الإجمالي</span>
              <span className="text-primary font-black text-lg">{cartTotal} {currency}</span>
            </div>
          </div>

          {/* Customer Form */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">بيانات التوصيل</h4>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
                <User className="h-3.5 w-3.5" /> الاسم بالكامل
              </label>
              <input
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className={`${inputClass} ${errors.name ? "ring-2 ring-red-500/50 border-red-500/30" : ""}`}
                placeholder="مثال: محمد أحمد"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
                <Phone className="h-3.5 w-3.5" /> رقم الهاتف
              </label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center bg-primary/10 text-primary font-bold text-sm rounded-xl px-4 border border-primary/20 whitespace-nowrap" dir="ltr">
                  {countryCode}
                </span>
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/[^0-9]/g, "") })}
                  className={`${inputClass} flex-1 ${errors.phone ? "ring-2 ring-red-500/50 border-red-500/30" : ""}`}
                  placeholder="5xxxxxxxx"
                  dir="ltr"
                  type="tel"
                  inputMode="numeric"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
                <MapPin className="h-3.5 w-3.5" /> العنوان بالتفصيل
              </label>
              <textarea
                rows={3}
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className={`${inputClass} resize-none ${errors.address ? "ring-2 ring-red-500/50 border-red-500/30" : ""}`}
                placeholder="المدينة - الحي - اسم الشارع - رقم المبنى..."
              />
              {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="p-5 border-t border-white/10 bg-background pb-safe">
          <Button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg h-14 rounded-2xl transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 mb-3 disabled:opacity-50 disabled:scale-100"
          >
            {isSending ? (
              <><Loader2 className="h-6 w-6 animate-spin" /> جاري إرسال الطلب...</>
            ) : (
              <><MessageCircle className="h-6 w-6" /> إرسال الطلب عبر واتساب</>
            )}
          </Button>
          <p className="text-center text-[10px] text-gray-500 font-medium">
            الأسعار شاملة ضريبة القيمة المضافة. يضاف 12% خدمة داخل الصالة.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
