import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import { CountryProvider } from '@/lib/CountryContext'
import { CartProvider } from '@/lib/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'Shrimp Zone | شرمب زون - الطعم الأصلي للمأكولات البحرية',
  description: 'اطلب الآن أشهى المأكولات البحرية، أكياس الجمبري والصواني العائلية من شرمب زون. متواجدون في السعودية ومصر.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground pb-20 md:pb-0`} suppressHydrationWarning>
        <CountryProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <BottomNav />
            <CartDrawer />
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  )
}
