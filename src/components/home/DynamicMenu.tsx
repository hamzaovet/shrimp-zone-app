"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCountry } from "@/lib/CountryContext";
import { useCart } from "@/lib/CartContext";
import { KSA_MENU, EGYPT_MENU } from "@/lib/data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DynamicMenu() {
  const { country, isHydrated } = useCountry();
  const { addToCart } = useCart();
  const menuData = country === 'ksa' ? KSA_MENU : EGYPT_MENU;
  const [activeCategory, setActiveCategory] = useState(menuData[0].category);

  useEffect(() => {
    setActiveCategory(menuData[0].category);
  }, [country, menuData]);

  if (!isHydrated) return null;

  const currentCategoryData = menuData.find(cat => cat.category === activeCategory) || menuData[0];
  const currency = country === 'ksa' ? 'SAR' : 'EGP';

  return (
    <section className="py-16 bg-background w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black text-white text-center mb-10">قائمة الطعام</h2>
        
        <div className="flex overflow-x-auto gap-3 pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {menuData.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(cat.category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat.category
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,87,34,0.4)] scale-105'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 min-h-[400px]">
          {currentCategoryData.items.map((item) => (
            <Card key={item.id} className="bg-secondary/40 border-white/10 overflow-hidden group rounded-xl">
              <div className="relative h-48 w-full overflow-hidden bg-white/5 rounded-t-lg">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                  <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                    {item.price} {currency}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button 
                  onClick={() => addToCart({ id: item.id, title: item.title, price: item.price })}
                  className="w-full bg-[#FF5722] hover:bg-[#FF5722]/80 text-white font-bold transition-all duration-300 rounded-xl hover:scale-[1.02] shadow-md"
                >
                  أضف للسلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
