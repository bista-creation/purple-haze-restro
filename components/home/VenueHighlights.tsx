'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Check, Calendar, ArrowRight } from 'lucide-react'
import { VENUES_DATA } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function VenueHighlights() {
  const [selectedPhoto, setSelectedPhoto] = useState<Record<string, number>>({})

  return (
    <section className="py-24 bg-muted/40 dark:bg-charcoal-900/50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-700 dark:text-gold-400 mb-2 inline-block">
            Celebrations &amp; Gatherings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Bespoke Venues &amp; Open Garden
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
            Whether you are organizing a fairytale wedding, an open-air birthday under fairy lights, or an executive corporate conference in Biratnagar — explore our genuine on-site spaces.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VENUES_DATA.map((venue, index) => {
            const currentPhotoIdx = selectedPhoto[venue.id] || 0
            const currentPhoto = venue.images[currentPhotoIdx] || venue.images[0]

            return (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group rounded-3xl bg-card border border-border overflow-hidden shadow-md hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Banner */}
                <div className="relative h-64 w-full overflow-hidden bg-muted">
                  <Image
                    src={currentPhoto}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-transparent to-transparent" />

                  {/* Capacity Badge */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground flex items-center gap-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>Up to {venue.capacity} Guests</span>
                  </div>

                  {/* Price Banner */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-purple-200/90 font-medium">Packages starting from</p>
                      <p className="text-xl font-bold text-amber-400">
                        {formatPrice(venue.priceFrom)}
                      </p>
                    </div>

                    {/* Thumbnail Switchers */}
                    {venue.images.length > 1 && (
                      <div className="flex items-center gap-1.5 bg-charcoal-950/60 p-1 rounded-xl backdrop-blur-md border border-white/10">
                        {venue.images.map((img, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedPhoto((prev) => ({ ...prev, [venue.id]: imgIdx }))
                            }}
                            className={`relative w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                              currentPhotoIdx === imgIdx
                                ? 'border-amber-400 scale-105 shadow-sm'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            aria-label={`View photo ${imgIdx + 1}`}
                          >
                            <Image
                              src={img}
                              alt="Thumbnail"
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Venue Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {venue.description}
                    </p>

                    {/* Key Features */}
                    <div className="space-y-2.5 pt-3 border-t border-border/60">
                      {venue.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/85">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 pt-4 border-t border-border flex items-center gap-3">
                    <Button
                      asChild
                      className="flex-1 bg-primary hover:bg-primary-700 text-white rounded-2xl text-xs font-semibold h-11 shadow-sm"
                    >
                      <Link href={`/events?venue=${venue.slug}`} className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Enquire &amp; Book
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-2xl text-xs font-semibold h-11 border-primary/30 text-primary hover:bg-primary/10 px-4"
                    >
                      <Link href="/events" className="flex items-center gap-1">
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
