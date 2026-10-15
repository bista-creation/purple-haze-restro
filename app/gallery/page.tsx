'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { GALLERY_DATA } from '@/lib/data/restaurant-data'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Moments' },
    { id: 'food', label: 'Culinary Delights' },
    { id: 'garden', label: 'Garden & Fountains' },
    { id: 'banquet', label: 'Grand Banquet' },
    { id: 'events', label: 'Weddings & Celebrations' },
    { id: 'ambiance', label: 'Indoor Lounge & Nightlife' },
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
      <section className="bg-charcoal-950 text-white py-14 sm:py-18 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> A Visual Tour
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Moments at Purple Haze
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Glimpse into our serene garden grounds, lavish banquets, vibrant celebrations, and masterfully plated delicacies in Biratnagar.
          </p>
        </div>
      </section>

      {/* Main Gallery */}
      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-muted cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block mb-1">
                    {img.category}
                  </span>
                  <h4 className="text-xs font-semibold leading-snug">
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
            <DialogContent className="max-w-4xl p-0 bg-charcoal-950/95 border-none text-white overflow-hidden rounded-2xl">
              <div className="relative h-[70vh] w-full flex items-center justify-center">
                <Image
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].caption}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Navigation arrows */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Caption bottom bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
                  <p className="text-sm font-semibold">
                    {filteredImages[lightboxIndex].caption}
                  </p>
                  <p className="text-xs text-purple-200/70 mt-1">
                    Image {lightboxIndex + 1} of {filteredImages.length}
                  </p>
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
