'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  CheckCircle2,
  XCircle,
  Truck,
  Store,
  Utensils,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { RESTAURANT_INFO, AVAILABLE_COUPONS } from '@/lib/data/restaurant-data'

export function MiniCart() {
  const {
    isOpen,
    setIsOpen,
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    orderType,
    setOrderType,
    deliveryZone,
    setDeliveryZone,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    deliveryFee,
  } = useCartStore()

  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  const subtotal = getSubtotal()
  const discount = getDiscountAmount()
  const total = getTotal()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')

    const code = couponCode.trim().toUpperCase()
    if (!code) return

    const found = AVAILABLE_COUPONS.find((c) => c.code === code)
    if (!found) {
      setCouponError('Invalid coupon code. Try PURPLE10 or FLAT100.')
      return
    }

    if (subtotal < found.minOrderValue) {
      setCouponError(
        `Order must be at least Rs. ${found.minOrderValue} to use this coupon.`
      )
      return
    }

    let calculatedDiscount = 0
    if (found.type === 'PERCENTAGE') {
      calculatedDiscount = (subtotal * found.value) / 100
      if (found.maxDiscount && calculatedDiscount > found.maxDiscount) {
        calculatedDiscount = found.maxDiscount
      }
    } else {
      calculatedDiscount = found.value
    }

    applyCoupon({
      id: found.code,
      code: found.code,
      type: found.type,
      value: found.value,
      minOrderValue: found.minOrderValue,
      maxDiscount: found.maxDiscount,
      discountAmount: calculatedDiscount,
    })
    setCouponCode('')
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md p-0 bg-background border-l border-border shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="p-4 sm:p-5 border-b border-border/70 flex flex-row items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-serif font-bold text-foreground">
                Your Order Cart
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Order Type Switcher */}
        <div className="px-4 py-2.5 bg-muted/60 border-b border-border/60">
          <div className="grid grid-cols-3 gap-1 bg-background p-1 rounded-xl border border-border/80">
            <button
              type="button"
              onClick={() => setOrderType('DELIVERY')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                orderType === 'DELIVERY'
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-foreground/75 hover:text-foreground hover:bg-muted'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Delivery
            </button>
            <button
              type="button"
              onClick={() => setOrderType('PICKUP')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                orderType === 'PICKUP'
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-foreground/75 hover:text-foreground hover:bg-muted'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> Takeaway
            </button>
            <button
              type="button"
              onClick={() => setOrderType('DINE_IN')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                orderType === 'DINE_IN'
                  ? 'bg-primary text-white shadow-sm font-bold'
                  : 'text-foreground/75 hover:text-foreground hover:bg-muted'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" /> Dine-In
            </button>
          </div>

          {orderType === 'DELIVERY' && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Delivery Zone:</span>
              <select
                aria-label="Delivery Zone"
                value={deliveryZone}
                onChange={(e) => {
                  const zone = RESTAURANT_INFO.deliveryZones.find(
                    (z) => z.name === e.target.value
                  )
                  if (zone) setDeliveryZone(zone.name, zone.fee)
                }}
                className="bg-transparent border-none text-foreground font-medium focus:ring-0 cursor-pointer text-right max-w-[200px] truncate"
              >
                {RESTAURANT_INFO.deliveryZones.map((zone) => (
                  <option key={zone.name} value={zone.name} className="bg-background text-foreground">
                    {zone.name} (+{formatPrice(zone.fee)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-border/40">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Your cart is hungry!
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                Explore our Nepali, Indian, Chinese and Italian specialties and add your favorites.
              </p>
              <Button
                asChild
                className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/menu">Browse Delicious Menu</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-muted">
                  <Image
                    src={item.dish.image || '/images/food-presentation.jpg'}
                    alt={item.dish.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {item.dish.name}
                      </h4>
                      {item.variant && (
                        <p className="text-[10px] text-primary font-medium">
                          Size/Variant: {item.variant.name}
                        </p>
                      )}
                      {item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-muted-foreground truncate">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-foreground">
                      {formatPrice(item.totalPrice)}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden bg-muted/40">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-foreground min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <SheetFooter className="p-4 sm:p-5 border-t border-border bg-background space-y-3 block">
            {/* Promo Code Box */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-950 dark:text-gold-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coupon {appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-destructive hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Coupon: PURPLE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-8 h-8 text-xs rounded-lg uppercase"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3 rounded-lg border-primary/40 text-primary font-bold hover:bg-primary/10"
                  >
                    Apply
                  </Button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {couponError}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs pt-1 border-t border-border/50 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {orderType === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery ({deliveryZone.split('(')[0].trim()})</span>
                  <span className="font-semibold text-foreground">{formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border/70">
                <span>Grand Total</span>
                <span className="text-primary text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl text-xs h-10 border-primary/30 text-primary font-semibold hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/cart">Full Cart</Link>
              </Button>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold h-10 shadow-md shadow-primary/20"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/checkout" className="flex items-center justify-center gap-1">
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
