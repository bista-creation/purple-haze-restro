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
  ArrowLeft,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/utils'
import { RESTAURANT_INFO, AVAILABLE_COUPONS } from '@/lib/data/restaurant-data'

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateItemNote,
    clearCart,
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
      setCouponError(`Order must be at least Rs. ${found.minOrderValue} to use this coupon.`)
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Your Food Cart
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Review your meal items, customize notes, and proceed to checkout.
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-destructive hover:bg-destructive/10"
            >
              Clear Entire Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-card rounded-3xl border border-border shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
              Looks like you haven&apos;t added any items yet. Check out our signature thalis, momos, pizzas, and curries!
            </p>
            <Button asChild className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs px-6">
              <Link href="/menu">Explore Our Menu</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Order Type Selector */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order Preference:
                </span>
                <div className="grid grid-cols-3 gap-1 bg-muted/70 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      orderType === 'DELIVERY'
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-foreground/75 hover:text-foreground hover:bg-background/80'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('PICKUP')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      orderType === 'PICKUP'
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-foreground/75 hover:text-foreground hover:bg-background/80'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" /> Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      orderType === 'DINE_IN'
                        ? 'bg-primary text-white shadow-xs font-bold'
                        : 'text-foreground/75 hover:text-foreground hover:bg-background/80'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" /> Dine-In
                  </button>
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6 divide-y divide-border/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-border bg-muted">
                        <Image
                          src={item.dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200'}
                          alt={item.dish.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {item.dish.name}
                        </h3>
                        {item.variant && (
                          <p className="text-xs font-medium text-primary">
                            Portion: {item.variant.name} ({formatPrice(item.variant.price)})
                          </p>
                        )}
                        {item.selectedAddOns.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Add-ons: {item.selectedAddOns.map((a) => `${a.name} (+${formatPrice(a.price)})`).join(', ')}
                          </p>
                        )}
                        <p className="text-xs font-bold text-foreground pt-1">
                          {formatPrice(item.unitPrice)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(item.totalPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-start">
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground">
                  <Link href="/menu">
                    <ArrowLeft className="w-3.5 h-3.5" /> Add more items from Menu
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-foreground border-b border-border/70 pb-3">
                Order Summary
              </h3>

              {/* Delivery Zone selection if delivery */}
              {orderType === 'DELIVERY' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Biratnagar Delivery Zone:
                  </label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => {
                      const z = RESTAURANT_INFO.deliveryZones.find((item) => item.name === e.target.value)
                      if (z) setDeliveryZone(z.name, z.fee)
                    }}
                    className="w-full bg-background border border-border rounded-xl text-xs h-10 px-3 text-foreground focus:ring-1 focus:ring-primary outline-none"
                  >
                    {RESTAURANT_INFO.deliveryZones.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name} (+{formatPrice(z.fee)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Coupon Box */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-950 dark:text-gold-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      <span>{appliedCoupon.code} Applied</span>
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
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <Input
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="h-10 text-xs rounded-xl uppercase"
                    />
                    <Button type="submit" variant="outline" className="h-10 text-xs px-4 rounded-xl border-primary/50 text-primary font-bold hover:bg-primary/10">
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
              <div className="space-y-2 text-xs text-muted-foreground border-t border-border/70 pt-4">
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
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-foreground">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-3">
                  <span>Total Amount</span>
                  <span className="text-primary text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold h-12 shadow-lg shadow-primary/20"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
