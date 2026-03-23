import Hero from '@/components/home/Hero'
import DynamicMenu from '@/components/home/DynamicMenu'
import Reviews from '@/components/home/Reviews'
import BrandStory from '@/components/home/BrandStory'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <DynamicMenu />
      <Reviews />
      <BrandStory />
      <Footer />
    </div>
  )
}
