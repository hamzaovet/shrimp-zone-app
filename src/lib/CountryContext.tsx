"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Country = 'ksa' | 'egypt';

interface CountryContextType {
  country: Country;
  setCountry: (country: Country) => void;
  isHydrated: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<Country>('ksa');
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration safety: ensures components that rely on state only render fully client-side when needed
  useEffect(() => {
    setIsHydrated(true);
    // Optional: read from localStorage if you wanted persistence, else default to 'ksa'
    const saved = localStorage.getItem('user_country') as Country;
    if (saved && (saved === 'ksa' || saved === 'egypt')) {
      setCountry(saved);
    }
  }, []);

  const changeCountry = (newCountry: Country) => {
    setCountry(newCountry);
    localStorage.setItem('user_country', newCountry);
  }

  return (
    <CountryContext.Provider value={{ country, setCountry: changeCountry, isHydrated }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
