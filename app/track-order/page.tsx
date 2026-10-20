'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
  Phone,
  Star,
  Sparkles,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

type TrackingStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const qOrderNumber = searchParams.get('orderNumber') || ''
  const qPhone = searchParams.get('phone') || ''

  const [orderNumberInput, setOrderNumberInput] = useState(qOrderNumber)
  const [phoneInput, setPhoneInput] = useState(qPhone)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [currentStatus, setCurrentStatus] = useState<TrackingStatus>('PREPARING')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const steps: { key: TrackingStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'PLACED',
      label: 'Order Placed',
      desc: 'Received and sent to Purple Haze kitchen',
      icon: Clock,
    },
    {
      key: 'CONFIRMED',
      label: 'Confirmed',
      desc: 'Order verified by restaurant manager',
      icon: CheckCircle2,
    },
    {
      key: 'PREPARING',
      label: 'Preparing in Kitchen',
      desc: 'Chefs cooking fresh in woks & tandoor',
      icon: ChefHat,
    },
    {
      key: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      desc: 'Rider en route to your Biratnagar address',
      icon: Truck,
    },
    {
      key: 'DELIVERED',
      label: 'Delivered & Enjoyed',
      desc: 'Handed over at your doorstep',
      icon: PackageCheck,
    },
  ]

  const performFetch = async (num: string, phone: string) => {
    setLoading(true)
    setNotFound(false)

    try {
      // 1. Check database via API first
      const cleanNum = num.trim().toUpperCase()
      const cleanPhone = phone.trim()
      const queryUrl = `/api/orders?orderNumber=${encodeURIComponent(cleanNum)}${
        cleanPhone ? `&phone=${encodeURIComponent(cleanPhone)}` : ''
      }`

      const res = await fetch(queryUrl)
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setCurrentOrder(data.data)
          setCurrentStatus(data.data.status || 'PLACED')
          setNotFound(false)
          return
        }
      }

      // 2. Fallback to localStorage (placed in this browser)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`order_${cleanNum}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setCurrentOrder(parsed)
          setCurrentStatus(parsed.status || 'PLACED')
          setNotFound(false)
          return
        }
      }

      // 3. Not found anywhere
      setCurrentOrder(null)
      setNotFound(true)
    } catch {
      // Check localStorage on network error
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`order_${num.trim().toUpperCase()}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setCurrentOrder(parsed)
          setCurrentStatus(parsed.status || 'PLACED')
          setNotFound(false)
          return
        }
      }
      setCurrentOrder(null)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSearched(true)
    const num = orderNumberInput.trim().toUpperCase()
    if (!num) return
    performFetch(num, phoneInput)
  }

  useEffect(() => {
    if (qOrderNumber) {
      performFetch(qOrderNumber, qPhone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qOrderNumber])

  // Periodic polling for active orders (every 12 seconds)
  useEffect(() => {
    if (!currentOrder || currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') return
    const interval = setInterval(() => {
      const num = currentOrder.orderNumber || currentOrder.id
      if (num) {
        fetch(`/api/orders?orderNumber=${encodeURIComponent(num)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.data?.status && d.data.status !== currentStatus) {
              setCurrentStatus(d.data.status)
              setCurrentOrder((prev: any) => ({ ...prev, ...d.data }))
              toast.info(`Order updated: ${d.data.status.replace(/_/g, ' ')}`)
            }
          })
          .catch(() => {})
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [currentOrder, currentStatus])

  const getStepIndex = (status: TrackingStatus) => {
    return steps.findIndex((s) => s.key === status)
  }

  const currentStepIndex = getStepIndex(currentStatus)

  // Demo status advancement button
  const advanceStatusDemo = () => {
    const sequence: TrackingStatus[] = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
    const nextIdx = Math.min(sequence.length - 1, currentStepIndex + 1)
    const nextStatus = sequence[nextIdx]
    setCurrentStatus(nextStatus)
    toast.info(`Order status updated to: ${nextStatus.replace(/_/g, ' ')}`)
  }

  // Cancel Order action
  const handleCancelOrder = () => {
    if (currentStatus !== 'PLACED') {
      toast.error('Orders cannot be cancelled once food preparation has started.')
      return
    }
    setCurrentStatus('CANCELLED')
    toast.success('Order has been cancelled.')
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setReviewSubmitted(true)
    toast.success('Thank you for rating your meal! Your review was recorded.')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-950 text-white py-14 sm:py-18 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Real-Time Kitchen & Courier Status
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Enter your Order Number (e.g. PH261014XXXX) and phone number to see the live kitchen and delivery progression.
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Order # (e.g. PH261014A3F2)"
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              required
              className="bg-background/90 text-foreground placeholder:text-muted-foreground rounded-xl h-11 text-xs uppercase"
            />
            <Input
              type="tel"
              placeholder="Phone (Optional)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="bg-background/90 text-foreground placeholder:text-muted-foreground rounded-xl h-11 text-xs sm:max-w-[140px]"
            />
            <Button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold rounded-xl text-xs h-11 px-5 shrink-0 shadow-md"
            >
              <Search className="w-4 h-4 mr-1" /> Track
            </Button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {currentOrder ? (
          <div className="space-y-8">
            {/* Live Status Card */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/80 gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Order ID
                  </span>
                  <h2 className="font-mono text-xl font-bold text-foreground">
                    {currentOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed: {formatDateTime(currentOrder.createdAt)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block">
                    Current Status
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentStatus === 'DELIVERED'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                        : currentStatus === 'CANCELLED'
                        ? 'bg-destructive/10 text-destructive border border-destructive/30'
                        : 'bg-primary/10 text-primary border border-primary/30'
                    }`}
                  >
                    {currentStatus.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Status Timeline Visualizer */}
              {currentStatus === 'CANCELLED' ? (
                <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-center space-y-2">
                  <XCircle className="w-10 h-10 text-destructive mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-destructive">
                    This order was cancelled
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    If you have questions regarding refunds, call our Biratnagar hotline at {RESTAURANT_INFO.primaryPhone}.
                  </p>
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  {/* Step Progress Line */}
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-0 hidden sm:block" />
                    <div
                      className="absolute top-4 left-4 h-0.5 bg-primary -z-0 hidden sm:block transition-all duration-500"
                      style={{
                        width: `${(currentStepIndex / (steps.length - 1)) * 95}%`,
                      }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                      {steps.map((step, idx) => {
                        const Icon = step.icon
                        const isDone = idx <= currentStepIndex
                        const isCurrent = idx === currentStepIndex

                        return (
                          <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-primary text-white shadow-md ring-4 ring-primary/20'
                                  : 'bg-muted text-muted-foreground border border-border'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-primary'
                                    : isDone
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {step.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Estimated Delivery Box */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Estimated Arrival Time</p>
                        <p className="text-[11px] text-muted-foreground">
                          {currentStatus === 'DELIVERED'
                            ? 'Delivered successfully!'
                            : 'Courier is on schedule for Biratnagar delivery'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {currentStatus === 'DELIVERED' ? 'Completed' : '~20-30 Mins'}
                    </span>
                  </div>

                  {/* Live Status Refresh Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs pt-2 gap-2">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin" />
                      Live connection active · Updates automatically as kitchen prepares order
                    </span>

                    <a
                      href={`tel:${RESTAURANT_INFO.primaryPhone}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3" /> Need Help? {RESTAURANT_INFO.primaryPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Post-Delivery Rating Prompt */}
            {currentStatus === 'DELIVERED' && (
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md">
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                  How was your experience with Purple Haze?
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Please rate the flavor and packaging quality. Your feedback helps our chefs in Biratnagar maintain excellence!
                </p>

                {reviewSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Thank you for rating our restaurant!
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star selector */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-gold-400 hover:scale-110 transition-transform"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-gold-400' : 'text-muted'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-foreground ml-2">
                        {rating} of 5 Stars
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Write a brief comment about the food quality, speed, or staff courtesy..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none resize-none"
                    />

                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs h-10 px-5"
                    >
                      Submit Review
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* Item Summary Details */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-foreground">
                Order Items Summary
              </h3>
              <div className="divide-y divide-border/60 text-xs">
                {currentOrder.items?.map((it: any, i: number) => (
                  <div key={i} className="py-2.5 flex justify-between">
                    <span>{it.quantity}x {it.dishName}</span>
                    <span className="font-bold text-foreground">{formatPrice(it.totalPrice)}</span>
                  </div>
                ))}
                <div className="pt-3 flex justify-between font-bold text-sm text-foreground">
                  <span>Grand Total Paid</span>
                  <span className="text-primary">{formatPrice(currentOrder.pricing?.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-3">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto text-primary" />
            <h3 className="font-serif text-lg font-bold text-foreground">
              Connecting to Kitchen Dispatch...
            </h3>
            <p className="text-xs text-muted-foreground">
              Retrieving live status for order #{orderNumberInput}...
            </p>
          </div>
        ) : (
          (searched || notFound) && (
            <div className="text-center py-16 bg-card border border-border rounded-3xl p-8 space-y-3">
              <AlertTriangle className="w-12 h-12 text-gold-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-foreground">
                Order Not Found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                We could not locate an active order for &ldquo;{orderNumberInput}&rdquo;. Please verify the order number on your bill or WhatsApp receipt.
              </p>
              <div className="pt-2">
                <a
                  href={`tel:${RESTAURANT_INFO.primaryPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-primary/10 px-4 py-2 rounded-xl"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Restaurant Hotline: {RESTAURANT_INFO.primaryPhone}
                </a>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TrackOrderContent />
    </React.Suspense>
  )
}
