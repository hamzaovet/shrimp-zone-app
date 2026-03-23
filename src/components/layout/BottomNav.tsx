"use client";

import { Home, Menu, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/lib/CartContext';
import { useCountry } from '@/lib/CountryContext';

export default function BottomNav() {
  const { cartCount, setDrawerOpen } = useCart();
  const { isHydrated } = useCountry();

  if (!isHydrated) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-background border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex h-16 items-center justify-around px-2">
        <button className="flex flex-col items-center justify-center gap-1 text-primary">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium">القائمة</span>
        </button>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-white transition-colors relative"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-bold text-white animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">السلة</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-white transition-colors">
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">حسابي</span>
        </button>
      </div>
    </div>
  )
}
