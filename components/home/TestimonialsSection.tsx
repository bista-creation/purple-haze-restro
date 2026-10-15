'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS_DATA } from '@/lib/data/restaurant-data'

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-600 dark:text-gold-400 mb-2 inline-block">
            Biratnagar’s Voice
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Stories from Our Guests
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-gold-500 mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            From relaxed family dinners in our open garden to lavish wedding celebrations and executive meetings, hear what our patrons have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_DATA.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed italic mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
