'use client'

import React from 'react'
import Image from 'next/image'
import { Instagram, Facebook, Heart, ExternalLink } from 'lucide-react'
import { RESTAURANT_INFO, GALLERY_DATA } from '@/lib/data/restaurant-data'
import { Button } from '@/components/ui/button'

export function SocialFeedSection() {
  const feedImages = GALLERY_DATA.slice(0, 6)

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
              Join over 5,000+ followers on Facebook & Instagram. Tag us in your food & garden memories!
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
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs gap-1.5 h-9 shadow-sm"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {feedImages.map((img) => (
            <a
              key={img.id}
              href={RESTAURANT_INFO.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-48 rounded-xl overflow-hidden bg-muted block shadow-sm"
            >
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                <Instagram className="w-5 h-5 text-gold-400 mb-1" />
                <span className="text-[10px] font-medium line-clamp-2">
                  {img.caption}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
