'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Utensils } from 'lucide-react'
import { CATEGORIES_DATA } from '@/lib/data/restaurant-data'

export function CuisineHighlights() {
  const cuisines = CATEGORIES_DATA.filter((cat) => cat.slug !== 'beverages')

  return (
    <section className="py-20 bg-muted/30 dark:bg-charcoal-900/40">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 inline-block">
            A Journey of Global & Local Tastes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Four Masterful Cuisines
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-gold-500 mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            From the soul-warming spices of the Himalayas to royal tandoors, fiery woks, and stone-baked Italian crusts, our chefs prepare every recipe with authentic authenticity.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cuisines.map((cuisine, index) => (
            <motion.div
              key={cuisine.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={cuisine.image || '/images/my-cuisine-photo.jpg'}
                  alt={cuisine.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-gold-500 text-charcoal-950 font-body shadow-sm">
                  {cuisine.dishCount}+ Specialties
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cuisine.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {cuisine.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border/60">
                  <Link
                    href={`/menu?category=${cuisine.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-700 transition-colors group/link"
                  >
                    <span>Explore {cuisine.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
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
