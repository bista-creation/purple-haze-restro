'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  SlidersHorizontal,
  Flame,
  Sparkles,
  UtensilsCrossed,
  X,
  RotateCcw,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { DishCard } from '@/components/menu/DishCard'
import { DISHES_DATA, CATEGORIES_DATA } from '@/lib/data/restaurant-data'
import { DishItem } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function MenuContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'

  const [dishes, setDishes] = useState<DishItem[]>(DISHES_DATA)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all')
  const [spicyFilter, setSpicyFilter] = useState<number | 'all'>('all')
  const [bestsellerOnly, setBestsellerOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')

  // Load latest dishes from store/API
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dishes) && data.dishes.length > 0) {
          setDishes(data.dishes)
        }
      })
      .catch(() => {})
  }, [])

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES_DATA.find((c) => c.slug === selectedCategory)
        if (cat && dish.categoryId !== cat.id && dish.category?.cuisine !== selectedCategory) {
          return false
        }
      }

      // Veg / Non-Veg
      if (vegFilter === 'veg' && !dish.isVeg) return false
      if (vegFilter === 'non-veg' && dish.isVeg) return false

      // Spicy level
      if (spicyFilter !== 'all' && dish.spicyLevel !== spicyFilter) return false

      // Bestseller
      if (bestsellerOnly && !dish.isPopular) return false

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = dish.name.toLowerCase().includes(q)
        const matchDesc = dish.description?.toLowerCase().includes(q)
        const matchTag = dish.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchName && !matchDesc && !matchTag) return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
    })
  }, [dishes, selectedCategory, searchQuery, vegFilter, spicyFilter, bestsellerOnly, sortBy])

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setVegFilter('all')
    setSpicyFilter('all')
    setBestsellerOnly(false)
    setSortBy('featured')
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    vegFilter !== 'all' ||
    spicyFilter !== 'all' ||
    bestsellerOnly

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-charcoal-950 text-white py-14 sm:py-16 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-block">
            Crafted with Fresh Local Ingredients
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Our Multi-Cuisine Menu
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Nepali Thakali & Newari thalis, rich Mughlai gravies, sizzling Hakka noodles, and authentic Italian pizzas — all prepared fresh to order in Biratnagar.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dishes, momos, pizzas, curries, thalis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-10 h-12 rounded-2xl bg-background/90 text-foreground placeholder:text-muted-foreground border-border/80 shadow-lg text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-border/60">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            All Cuisines ({DISHES_DATA.length})
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="bg-card border border-border/70 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Diet Filter */}
            <div className="inline-flex rounded-xl border border-border p-1 bg-muted/60">
              <button
                type="button"
                onClick={() => setVegFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  vegFilter === 'all' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setVegFilter('veg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  vegFilter === 'veg' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" /> Pure Veg
              </button>
              <button
                type="button"
                onClick={() => setVegFilter('non-veg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  vegFilter === 'non-veg' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" /> Non-Veg
              </button>
            </div>

            {/* Bestseller Toggle */}
            <button
              type="button"
              onClick={() => setBestsellerOnly(!bestsellerOnly)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                bestsellerOnly
                  ? 'bg-gold-500 text-charcoal-950 border-gold-600 font-bold shadow-xs'
                  : 'border-border bg-card text-foreground/80 hover:text-foreground hover:border-primary/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Bestsellers
            </button>

            {/* Spicy Filter */}
            <div className="hidden sm:inline-flex rounded-xl border border-border p-1 bg-muted/60 items-center text-xs">
              <span className="px-2 text-foreground/70 font-semibold">Spice:</span>
              <button
                type="button"
                onClick={() => setSpicyFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  spicyFilter === 'all' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Any
              </button>
              <button
                type="button"
                onClick={() => setSpicyFilter(0)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  spicyFilter === 0 ? 'bg-background text-foreground font-bold shadow-xs' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                Mild
              </button>
              <button
                type="button"
                onClick={() => setSpicyFilter(2)}
                className={`px-2 py-0.5 rounded-md flex items-center font-medium transition-all ${
                  spicyFilter === 2 ? 'bg-background text-rose-600 font-bold shadow-xs' : 'text-foreground/70 hover:text-rose-600'
                }`}
              >
                <Flame className="w-3 h-3 text-rose-500 fill-rose-500 inline mr-0.5" /> Medium
              </button>
              <button
                type="button"
                onClick={() => setSpicyFilter(3)}
                className={`px-2 py-0.5 rounded-md flex items-center font-medium transition-all ${
                  spicyFilter === 3 ? 'bg-background text-rose-700 font-bold shadow-xs' : 'text-foreground/70 hover:text-rose-700'
                }`}
              >
                <Flame className="w-3 h-3 text-rose-600 fill-rose-600 inline mr-0.5" /> Hot
              </button>
            </div>
          </div>

          {/* Right Controls: Sort & Clear */}
          <div className="flex items-center gap-3">
            <select
              aria-label="Sort dishes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-card text-xs font-semibold text-foreground rounded-xl border border-border px-3 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="featured">Sort: Featured & Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-primary border-primary/30 hover:bg-primary/10 h-8 gap-1 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* Dish Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredDishes.length}</strong> delicious dishes
          </p>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-20 px-4 bg-card rounded-3xl border border-border/80">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground">
              No dishes found matching your criteria
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or clearing filters to see our full culinary offerings.
            </p>
            <Button
              onClick={clearAllFilters}
              className="mt-6 bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}

export default function MenuPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MenuContent />
    </React.Suspense>
  )
}
