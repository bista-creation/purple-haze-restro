import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { HeroSection } from '@/components/home/HeroSection'
import { NewFeature } from '@/components/home/NewFeature'
import { CuisineHighlights } from '@/components/home/CuisineHighlights'
import { FeaturedDishes } from '@/components/home/FeaturedDishes'
import { VenueHighlights } from '@/components/home/VenueHighlights'
import { SpecialOffers } from '@/components/home/SpecialOffers'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { LocationSection } from '@/components/home/LocationSection'
import { SocialFeedSection } from '@/components/home/SocialFeedSection'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <NewFeature />
        <CuisineHighlights />
        <FeaturedDishes />
        <VenueHighlights />
        <SpecialOffers />
        <TestimonialsSection />
        <LocationSection />
        <SocialFeedSection />
      </main>
      <Footer />
      <MiniCart />
    </div>
  )
}
