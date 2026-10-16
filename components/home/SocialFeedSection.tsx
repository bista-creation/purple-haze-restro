'use client'

import React from 'react'
import Image from 'next/image'
import { Instagram, Facebook } from 'lucide-react'
import { RESTAURANT_INFO, GALLERY_DATA } from '@/lib/data/restaurant-data'
import { Button } from '@/components/ui/button'

export function SocialFeedSection() {
  // Curated showcase: garden, thali, night fairy lights, royal biryani, banquet hall, sizzling wok
  const feedImages = [
    GALLERY_DATA.find((g) => g.id === 'g-gard-1') || GALLERY_DATA[0],
    GALLERY_DATA.find((g) => g.id === 'g-food-1') || GALLERY_DATA[1],
    GALLERY_DATA.find((g) => g.id === 'g-gard-4') || GALLERY_DATA[2],
    GALLERY_DATA.find((g) => g.id === 'g-food-7') || GALLERY_DATA[3],
    GALLERY_DATA.find((g) => g.id === 'g-banq-1') || GALLERY_DATA[4],
    GALLERY_DATA.find((g) => g.id === 'g-food-13') || GALLERY_DATA[5],
  ]

  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 inline-block">
              Connect With Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              #PurpleHazeBiratnagar
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Join our growing community on Instagram &amp; Facebook. Tag us in your food &amp; garden memories!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-500/10 text-xs gap-1.5 h-9"
            >
              <a
                href={RESTAURANT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-4 h-4 text-blue-600" /> Facebook
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-xs gap-1.5 h-9 shadow-sm hover:opacity-90"
            >
              <a
                href={RESTAURANT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </Button>
          </div>
        </div>

        {/* Gallery Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {feedImages.map((img) => (
            <a
              key={img.id}
              href={RESTAURANT_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-muted block shadow-sm border border-border/60 hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-charcoal-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white backdrop-blur-[2px]">
                <Instagram className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[11px] font-semibold leading-snug line-clamp-2">
                  {img.caption}
                </span>
                <span className="text-[10px] text-purple-200/80 mt-1 uppercase tracking-wider font-mono">
                  @purplehaze.brt
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
