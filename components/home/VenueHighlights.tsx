'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Sparkles, Check, ArrowRight, Calendar } from 'lucide-react'
import { VENUES_DATA } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function VenueHighlights() {
  return (
    <section className="py-20 bg-muted/40 dark:bg-charcoal-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-800 dark:text-gold-400 mb-2 inline-block">
            Celebrations & Meetings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Bespoke Venues & Open Garden
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-gold-500 mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Whether you are organizing a fairytale wedding, an open-air birthday under fairy lights, or an executive boardroom conference in Biratnagar, we provide complete hospitality, decor, and catering.
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VENUES_DATA.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group rounded-3xl bg-card border border-border overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-60 w-full overflow-hidden bg-muted">
                <Image
                  src={venue.images[0]}
                  alt={venue.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground flex items-center gap-1.5 shadow-md">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Up to {venue.capacity} Guests</span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[11px] text-purple-200/80">Packages starting from</p>
                  <p className="text-lg font-bold text-gold-400">
                    {formatPrice(venue.priceFrom)}
                  </p>
                </div>
              </div>

              {/* Venue Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {venue.description}
                  </p>

                  {/* Key Features */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    {venue.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <Button
                    asChild
                    className="flex-1 bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold h-10 shadow-sm"
                  >
                    <Link href={`/events?venue=${venue.slug}`} className="flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Enquire & Book
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl text-xs font-semibold h-10 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Link href="/events">Details</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
