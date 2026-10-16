'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Utensils } from 'lucide-react'
import { CATEGORIES_DATA } from '@/lib/data/restaurant-data'

export function CuisineHighlights() {
  const cuisines = CATEGORIES_DATA.filter((cat) => cat.slug !== 'beverages')

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>A Journey of Global & Local Tastes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Four Masterful Cuisines
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 via-amber-400 to-purple-600 mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
            From the soul-warming spices of the Himalayas to royal tandoors, fiery Asian woks, and rustic continental grills — our culinary team crafts every dish fresh from local and artisanal ingredients.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {cuisines.map((cuisine, index) => (
            <motion.div
              key={cuisine.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border/80 shadow-md hover:shadow-2xl hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={cuisine.image || '/images/my-cuisine-photo.jpg'}
                  alt={cuisine.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Gradient overlays for cinematic depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />
                <div className="absolute inset-0 bg-purple-950/15 group-hover:bg-purple-950/0 transition-colors" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-950/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white shadow-sm">
                  <Utensils className="w-3 h-3 text-amber-400" />
                  <span>Cuisine 0{index + 1}</span>
                </div>

                {/* Bottom Badge */}
                <span className="absolute bottom-3.5 left-3.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-charcoal-950 font-body shadow-md">
                  {cuisine.dishCount}+ Specialties
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {cuisine.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                    {cuisine.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Link
                    href={`/menu?category=${cuisine.slug}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-primary group-hover:text-primary-700 transition-colors"
                  >
                    <span>Explore Menu</span>
                    <span className="p-1.5 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
