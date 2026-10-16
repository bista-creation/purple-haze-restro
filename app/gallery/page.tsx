'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Calendar,
  Layers,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { GALLERY_DATA } from '@/lib/data/restaurant-data'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Moments' },
    { id: 'food', label: 'Culinary Delights' },
    { id: 'garden', label: 'Garden & Lawns' },
    { id: 'banquet', label: 'Grand Banquet Halls' },
    { id: 'events', label: 'Celebrations & Events' },
  ]

  const filteredImages =
    activeCategory === 'all'
      ? GALLERY_DATA
      : GALLERY_DATA.filter((img) => img.category === activeCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1
      )
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Authentic Visual Gallery
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Moments at Purple Haze
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Every image is photographed on-site at Purple Haze Restro &amp; Garden in Biratnagar — capturing our lush outdoor gardens, grand banquets, joyful celebrations, and signature culinary creations.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-purple-200/70 font-medium">
            <span>{GALLERY_DATA.length} Authentic Photos</span>
            <span className="text-white/30">·</span>
            <span>4 Distinct Cuisines</span>
            <span className="text-white/30">·</span>
            <span>350+ Guest Banquets</span>
          </div>
        </div>
      </section>

      {/* Main Gallery */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Category Filter Tabs with dynamic counters */}
        <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? GALLERY_DATA.length
                : GALLERY_DATA.filter((img) => img.category === cat.id).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'bg-card border border-border text-foreground/80 hover:text-foreground hover:bg-muted/70 hover:border-primary/40'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    activeCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-muted cursor-pointer shadow-sm hover:shadow-2xl border border-border/60 hover:border-primary/40 transition-all duration-500"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              {/* Bottom Subtle Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Glassmorphic Overlay Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-charcoal-950/60 backdrop-blur-md border border-white/15 text-amber-300">
                    {img.category}
                  </span>
                  <span className="p-2 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold leading-snug text-white/95 drop-shadow-md">
                    {img.caption}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <Dialog
            open={lightboxIndex !== null}
            onOpenChange={() => setLightboxIndex(null)}
          >
            <DialogContent className="max-w-4xl p-0 bg-charcoal-950/98 border border-white/10 text-white overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-[72vh] w-full flex items-center justify-center bg-black/60">
                <Image
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].caption}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-charcoal-950/70 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  aria-label="Close image modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Navigation arrows */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-charcoal-950/70 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-charcoal-950/70 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Details Bar */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                      {filteredImages[lightboxIndex].category} · Photo {lightboxIndex + 1} of {filteredImages.length}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                      {filteredImages[lightboxIndex].caption}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {filteredImages[lightboxIndex].category === 'food' ? (
                      <Button
                        asChild
                        size="sm"
                        className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs rounded-xl h-8 px-4"
                      >
                        <Link href="/menu">Order Dish</Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-xl h-8 px-4"
                      >
                        <Link href="/events">Book Venue</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
