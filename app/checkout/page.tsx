'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Truck,
  Store,
  Utensils,
  CreditCard,
  Banknote,
  Wallet,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useCartStore } from '@/store/cart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { formatPrice, generateOrderNumber } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items,
    orderType,
    setOrderType,
    deliveryZone,
    setDeliveryZone,
    deliveryFee,
    appliedCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    clearCart,
  } = useCartStore()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    area: 'Airport Line',
    city: 'Biratnagar',
    landmark: '',
    tableNumber: 'Table 4',
    scheduledTime: 'ASAP',
    scheduledFor: '',
    paymentMethod: 'CASH_ON_DELIVERY' as 'CASH_ON_DELIVERY' | 'ESEWA' | 'KHALTI',
    orderNotes: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search)
      const err = sp.get('error')
      if (err) {
        if (err.includes('esewa')) {
          setErrorMsg('eSewa payment was cancelled or not completed. You can try again or choose Cash on Delivery.')
        } else if (err.includes('khalti')) {
          setErrorMsg('Khalti payment was cancelled or not completed. You can try again or choose Cash on Delivery.')
        } else {
          setErrorMsg('Online payment was not completed. Please try again or select Cash on Delivery.')
        }
      }
    }
  }, [])

  const subtotal = getSubtotal()
  const discount = getDiscountAmount()
  const total = getTotal()

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Add dishes before checkout.')
      return
    }

    if (!formData.name || !formData.phone) {
      setErrorMsg('Please provide your name and phone number for order delivery/confirmation.')
      return
    }

    if (orderType === 'DELIVERY' && (!formData.street || !formData.area)) {
      setErrorMsg('Street address and area are required for delivery in Biratnagar.')
      return
    }

    setSubmitting(true)

    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Create order payload snapshot
    const orderSnapshot = {
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      },
      orderType,
      deliveryZone: orderType === 'DELIVERY' ? deliveryZone : null,
      address:
        orderType === 'DELIVERY'
          ? {
              street: formData.street,
              area: formData.area,
              city: formData.city,
              landmark: formData.landmark,
            }
          : null,
      tableNumber: orderType === 'DINE_IN' ? formData.tableNumber : null,
      items: items.map((item) => ({
        id: item.id,
        dishId: item.dishId,
        dishName: item.dish.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        variantName: item.variant?.name || null,
        selectedAddOns: item.selectedAddOns.map((a) => a.name),
        specialNote: item.specialNote || null,
      })),
      pricing: {
        subtotal,
        discount,
        couponCode: appliedCoupon?.code || null,
        deliveryFee: orderType === 'DELIVERY' ? deliveryFee : 0,
        total,
      },
      payment: {
        method: formData.paymentMethod,
        status: formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING (AWAITING GATEWAY)',
        amount: total,
      },
      status: 'PLACED',
      estimatedTime: 35, // minutes
      orderNotes: formData.orderNotes,
    }

    // Attempt sending to /api/orders
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customer: { name: formData.name, phone: formData.phone, email: formData.email },
          orderType,
          items: orderSnapshot.items,
          pricing: orderSnapshot.pricing,
          paymentMethod: formData.paymentMethod,
          tableNumber: orderType === 'DINE_IN' ? formData.tableNumber : null,
          deliveryZone: orderType === 'DELIVERY' ? deliveryZone : null,
          address: orderSnapshot.address,
          orderNotes: formData.orderNotes,
        }),
      })
    } catch (apiErr) {
      console.warn('API sync deferred to offline cache', apiErr)
    }

    // Persist order snapshot in localStorage for guests/tracking
    if (typeof window !== 'undefined') {
      const existingOrders = JSON.parse(localStorage.getItem('purple_haze_orders') || '[]')
      existingOrders.unshift(orderSnapshot)
      localStorage.setItem('purple_haze_orders', JSON.stringify(existingOrders))
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderSnapshot))
    }

    // 1. Handle eSewa ePay v2 gateway redirect
    if (formData.paymentMethod === 'ESEWA') {
      toast.info('Connecting to eSewa payment gateway...')
      try {
        const esewaRes = await fetch('/api/payment/esewa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            totalAmount: total,
            deliveryFee: orderType === 'DELIVERY' ? deliveryFee : 0,
          }),
        })
        const esewaData = await esewaRes.json()

        if (esewaData.success && esewaData.formUrl && esewaData.fields) {
          const form = document.createElement('form')
          form.method = 'POST'
          form.action = esewaData.formUrl
          Object.entries(esewaData.fields).forEach(([key, val]) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = String(val)
            form.appendChild(input)
          })
          document.body.appendChild(form)
          form.submit()
          return
        }
        throw new Error(esewaData.error || 'Failed to initialize eSewa payment')
      } catch (esewaErr: any) {
        setSubmitting(false)
        setErrorMsg(esewaErr.message || 'Unable to connect to eSewa. Please choose another payment method.')
        toast.error('eSewa Error: ' + (esewaErr.message || 'Connection failed'))
        return
      }
    }

    // 2. Handle Khalti ePayment v2 gateway redirect
    if (formData.paymentMethod === 'KHALTI') {
      toast.info('Connecting to Khalti digital wallet...')
      try {
        const khaltiRes = await fetch('/api/payment/khalti/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            totalAmount: total,
            customer: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          }),
        })
        const khaltiData = await khaltiRes.json()

        if (khaltiData.success && khaltiData.paymentUrl) {
          window.location.href = khaltiData.paymentUrl
          return
        }
        throw new Error(khaltiData.error || 'Failed to initialize Khalti payment')
      } catch (khaltiErr: any) {
        setSubmitting(false)
        setErrorMsg(khaltiErr.message || 'Unable to connect to Khalti. Please choose another payment method.')
        toast.error('Khalti Error: ' + (khaltiErr.message || 'Connection failed'))
        return
      }
    }

    // 3. Cash on Delivery (Standard flow)
    await new Promise((r) => setTimeout(r, 600))
    clearCart()
    setSubmitting(false)
    toast.success(`Order ${orderNumber} placed successfully!`)
    router.push(`/order-confirmation/${orderNumber}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-1 block">
            Checkout & Confirmation
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Complete Your Food Order
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center bg-card rounded-3xl border border-border p-8">
            <h2 className="font-serif text-xl font-bold text-foreground mb-2">
              No items in checkout
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button asChild className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs">
              <Link href="/menu">Go to Menu</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery & Payment Details */}
            <div className="lg:col-span-8 space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Order Type Switcher */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">1</span>
                  Select Order Service Type
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <label
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                      orderType === 'DELIVERY'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary font-bold text-primary shadow-xs'
                        : 'border-border bg-card text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === 'DELIVERY'}
                      onChange={() => setOrderType('DELIVERY')}
                      className="sr-only"
                    />
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Doorstep Delivery</span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                      orderType === 'PICKUP'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary font-bold text-primary shadow-xs'
                        : 'border-border bg-card text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === 'PICKUP'}
                      onChange={() => setOrderType('PICKUP')}
                      className="sr-only"
                    />
                    <Store className="w-5 h-5 text-primary" />
                    <span>Restaurant Pickup</span>
                  </label>

                  <label
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                      orderType === 'DINE_IN'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary font-bold text-primary shadow-xs'
                        : 'border-border bg-card text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-muted/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      checked={orderType === 'DINE_IN'}
                      onChange={() => setOrderType('DINE_IN')}
                      className="sr-only"
                    />
                    <Utensils className="w-5 h-5 text-primary" />
                    <span>Dine-In Table</span>
                  </label>
                </div>
              </div>

              {/* 2. Customer Contact Info */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">2</span>
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                    <Input
                      required
                      placeholder="e.g. Ramesh KC"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="e.g. 98520XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Email (for receipt) *</label>
                    <Input
                      required
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Address & Timing (if Delivery) */}
              {orderType === 'DELIVERY' && (
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">3</span>
                    Delivery Address in Biratnagar
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">
                          Delivery Zone (Biratnagar) *
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
                              {z.name} (+{formatPrice(z.fee)} / est. {z.estTime})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Area / Locality *</label>
                        <Input
                          required
                          placeholder="e.g. Tintoliya, Roadcess, Kanchanbari"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="rounded-xl text-xs h-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Street / House / Tole *</label>
                        <Input
                          required
                          placeholder="e.g. House #14, Lane 2, Near Ward Office"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="rounded-xl text-xs h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block">Nearby Landmark (Optional)</label>
                        <Input
                          placeholder="e.g. Opposite Nepal Police School"
                          value={formData.landmark}
                          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                          className="rounded-xl text-xs h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Table details if Dine-in */}
              {orderType === 'DINE_IN' && (
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Table Seating Details
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Table Number or Area</label>
                    <Input
                      placeholder="e.g. Garden Table 12, Fountain Pergola 3"
                      value={formData.tableNumber}
                      onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                      className="rounded-xl text-xs h-10 max-w-xs"
                    />
                  </div>
                </div>
              )}

              {/* 4. Payment Method */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">4</span>
                  Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Cash on delivery */}
                  <label
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      formData.paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-xs'
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Cash on Delivery / Dine-in Cash</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Pay with cash or Fonepay QR upon receipt.</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                  </label>

                  {/* eSewa */}
                  <label
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      formData.paymentMethod === 'ESEWA'
                        ? 'border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600 shadow-xs'
                        : 'border-border bg-card hover:border-emerald-500/40 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        eSewa
                      </div>
                      <div>
                        <p className="font-bold text-foreground">eSewa Mobile Wallet (Sandbox / Live)</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Instant payment via eSewa digital wallet account.</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ESEWA"
                      checked={formData.paymentMethod === 'ESEWA'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'ESEWA' })}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                  </label>

                  {/* Khalti */}
                  <label
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      formData.paymentMethod === 'KHALTI'
                        ? 'border-purple-600 bg-purple-500/10 ring-2 ring-purple-600 shadow-xs'
                        : 'border-border bg-card hover:border-purple-500/40 hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        Khalti
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Khalti Digital Wallet / NetBanking</p>
                        <p className="text-[11px] text-muted-foreground font-medium">Pay securely with Khalti wallet or connected bank account.</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="KHALTI"
                      checked={formData.paymentMethod === 'KHALTI'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'KHALTI' })}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Delivery / Kitchen Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ring the bell twice, keep cutlery, extra spicy tomato achar..."
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>
            </div>

            {/* Right Column: Order Summary & Confirm Button */}
            <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-foreground border-b border-border/70 pb-3">
                Order Review
              </h3>

              {/* Mini Item List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-border/40">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground">
                        {item.quantity}x {item.dish.name}
                      </span>
                      {item.variant && (
                        <p className="text-[10px] text-muted-foreground">
                          {item.variant.name}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-foreground">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
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
                    <span>Delivery ({deliveryZone.split('(')[0].trim()})</span>
                    <span className="font-semibold text-foreground">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-3">
                  <span>Final Total</span>
                  <span className="text-primary text-xl font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Guarantee info */}
              <div className="p-3 rounded-xl bg-muted/60 text-muted-foreground text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Prepared fresh & packed in eco-friendly tamper-proof containers.</span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold h-12 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {submitting ? 'Placing Order...' : `Confirm & Place Order (${formatPrice(total)})`}
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}
