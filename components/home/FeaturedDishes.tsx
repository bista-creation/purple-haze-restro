'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { DISHES_DATA, CATEGORIES_DATA } from '@/lib/data/restaurant-data'
import { DishCard } from '@/components/menu/DishCard'
import { Button } from '@/components/ui/button'

export function FeaturedDishes() {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all')

  const filteredDishes =
    selectedCuisine === 'all'
      ? DISHES_DATA.filter((d) => d.isFeatured || d.isPopular).slice(0, 8)
      : DISHES_DATA.filter(
          (d) =>
            d.category?.cuisine?.toLowerCase() === selectedCuisine.toLowerCase()
        ).slice(0, 8)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-amber-800 dark:text-gold-400 mb-2 inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-gold-400" /> Chef&apos;s Recommendations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Most Loved & Signature Dishes
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto rounded-xl border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold gap-1.5"
          >
            <Link href="/menu">
              View Full Menu <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Cuisine Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCuisine('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCuisine === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            All Favorites
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCuisine(cat.cuisine || cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCuisine === (cat.cuisine || cat.slug)
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  )
}
