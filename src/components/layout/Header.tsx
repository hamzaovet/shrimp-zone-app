"use client";
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCountry } from '@/lib/CountryContext'
import { useCart } from '@/lib/CartContext'
import { ShoppingBag } from 'lucide-react'

export default function Header() {
  const { country, setCountry, isHydrated } = useCountry();
  const { cartCount, setDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LOGO: Far Right due to RTL */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative w-[120px] h-[40px]">
            <Image src="/logo_1.png" alt="Shrimp Zone Logo" fill className="object-contain" priority />
          </div>
        </div>

        {/* LEFT CONTROLS */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDrawerOpen(true)} 
            className="relative p-2 text-white hover:text-primary transition-colors bg-white/5 rounded-full border border-white/10"
          >
            <ShoppingBag className="h-5 w-5" />
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#FF5722] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* COUNTRY SELECTOR */}
          {isHydrated ? (
            <Select value={country} onValueChange={(v: any) => setCountry(v)}>
              <SelectTrigger className="w-[120px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="اختر الدولة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ksa">🇸🇦 السعودية</SelectItem>
                <SelectItem value="egypt">🇪🇬 مصر</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="w-[120px] h-[40px] border border-white/20 rounded-md bg-white/5 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  )
}
