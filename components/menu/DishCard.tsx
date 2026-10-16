'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus,
  Flame,
  Clock,
  Sparkles,
  Check,
  Heart,
  SlidersHorizontal,
} from 'lucide-react'
import { DishItem, DishVariantItem, AddOnItem } from '@/types'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface DishCardProps {
  dish: DishItem
}

export function DishCard({ dish }: DishCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<DishVariantItem | null>(
    dish.variants && dish.variants.length > 0 ? dish.variants[0] : null
  )
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnItem[]>([])
  const [specialNote, setSpecialNote] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)

  const hasOptions =
    (dish.variants && dish.variants.length > 0) ||
    (dish.addOns && dish.addOns.length > 0)

  const handleQuickAdd = () => {
    if (hasOptions) {
      setModalOpen(true)
    } else {
      addItem(dish, null, [], 1, '')
      toast.success(`Added ${dish.name} to cart!`, {
        description: `${formatPrice(dish.price)} • Cart updated`,
      })
    }
  }

  const handleCustomizedAdd = () => {
    addItem(dish, selectedVariant, selectedAddOns, quantity, specialNote)
    setModalOpen(false)
    toast.success(`Added ${dish.name} to cart!`, {
      description: `${quantity}x customized items added`,
    })
    // Reset modal state
    setQuantity(1)
    setSpecialNote('')
  }

  const toggleAddOn = (addOn: AddOnItem) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id))
    } else {
      setSelectedAddOns([...selectedAddOns, addOn])
    }
  }

  const currentUnitPrice =
    (selectedVariant ? selectedVariant.price : dish.price) +
    selectedAddOns.reduce((acc, a) => acc + a.price, 0)

  return (
    <>
      <div className="group relative rounded-2xl bg-card border border-border/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        {/* Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={dish.image || '/images/food-presentation.jpg'}
            alt={dish.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md shadow-sm border border-border/50">
            <span
              className={`w-2 h-2 rounded-full ${
                dish.isVeg ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-red-500 ring-2 ring-red-500/20'
              }`}
            />
            <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
              {dish.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => {
              setIsFavorited(!isFavorited)
              toast.info(
                isFavorited
                  ? `Removed ${dish.name} from favorites`
                  : `Saved ${dish.name} to favorites!`
              )
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-background transition-colors"
            aria-label="Save to Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>

          {/* Bestseller Badge */}
          {dish.isPopular && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-[10px] border-none shadow-md gap-1">
                <Sparkles className="w-3 h-3" /> Bestseller
              </Badge>
            </div>
          )}

          {/* Spicy Level Badge */}
          {dish.spicyLevel > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-background/90 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-border/50">
              {Array.from({ length: dish.spicyLevel }).map((_, i) => (
                <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
              ))}
            </div>
          )}
        </div>

        {/* Dish Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {dish.name}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
              {dish.description}
            </p>

            {/* Preparation time & category tag */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {dish.preparationTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-500" />
                  {dish.preparationTime} mins
                </span>
              )}
              {dish.category && (
                <span className="font-medium text-primary">
                  {dish.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Price & CTA Button */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground block">Price</span>
              <span className="text-base font-bold text-foreground">
                {formatPrice(dish.price)}
              </span>
            </div>

            <Button
              onClick={handleQuickAdd}
              size="sm"
              className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold px-3 h-8 shadow-sm gap-1 hover:shadow-md transition-all"
            >
              {hasOptions ? (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Customize
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Customization Dialog */}
      {hasOptions && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-background border border-border">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-foreground">
                Customize {dish.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Select your preferred portion and optional add-ons.
              </p>
            </DialogHeader>

            <div className="space-y-4 my-2 max-h-[60vh] overflow-y-auto pr-1">
              {/* Variants / Portion Size */}
              {dish.variants && dish.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Select Portion Size
                  </label>
                  <div className="space-y-1.5">
                    {dish.variants.map((v) => (
                      <label
                        key={v.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                          selectedVariant?.id === v.id
                            ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs'
                            : 'border-border bg-card text-foreground/80 hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="portion"
                            checked={selectedVariant?.id === v.id}
                            onChange={() => setSelectedVariant(v)}
                            className="text-primary focus:ring-primary w-3.5 h-3.5"
                          />
                          <span>{v.name}</span>
                        </div>
                        <span className="font-bold text-foreground">{formatPrice(v.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {dish.addOns && dish.addOns.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Add-ons & Extras
                  </label>
                  <div className="space-y-1.5">
                    {dish.addOns.map((addon) => {
                      const isChecked = selectedAddOns.some((a) => a.id === addon.id)
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary shadow-xs'
                              : 'border-border bg-card text-foreground/80 hover:text-foreground hover:bg-muted/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleAddOn(addon)}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span>{addon.name}</span>
                          </div>
                          <span className="font-semibold">+{formatPrice(addon.price)}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Special Kitchen Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, extra lemon on side..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-muted/40 p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs font-semibold text-foreground">Quantity</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/40">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-muted text-foreground"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-muted text-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 pt-4 border-t border-border flex sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground block">Total Item Price</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(currentUnitPrice * quantity)}
                </span>
              </div>
              <Button
                onClick={handleCustomizedAdd}
                className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold px-6 py-2 h-10 shadow-md"
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
