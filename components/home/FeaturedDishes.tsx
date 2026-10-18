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
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-5">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-gold-400 mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chef&apos;s Signature Recommendations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
              Most Loved &amp; Signature Dishes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl">
              Freshly prepared with authentic ingredients, house spice blends, and authentic recipes.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto rounded-2xl border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold gap-2 h-11 px-5 shadow-sm"
          >
            <Link href="/menu">
              View Complete Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Cuisine Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCuisine('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              selectedCuisine === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <span>All Favorites</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              selectedCuisine === 'all' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {DISHES_DATA.filter((d) => d.isFeatured || d.isPopular).length}
            </span>
          </button>

          {CATEGORIES_DATA.map((cat) => {
            const count = DISHES_DATA.filter(
              (d) => d.category?.cuisine?.toLowerCase() === (cat.cuisine || cat.slug).toLowerCase()
            ).length

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCuisine(cat.cuisine || cat.slug)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  selectedCuisine === (cat.cuisine || cat.slug)
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                    : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  selectedCuisine === (cat.cuisine || cat.slug) ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
             )
          })}
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
