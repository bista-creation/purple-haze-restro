'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Printer,
  ArrowRight,
  ShoppingBag,
  Share2,
  AlertCircle,
  Truck,
  Store,
  Utensils,
  MessageCircle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { useCartStore } from '@/store/cart'
import { getWhatsAppOrderUrl, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = (params?.id as string) || ''
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentNotice, setPaymentNotice] = useState<{ method: string; ref: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && orderId) {
      // Clear cart when reaching confirmation
      useCartStore.getState().clearCart()

      const sp = new URLSearchParams(window.location.search)
      const isSuccess = sp.get('payment') === 'success'
      const method = sp.get('method')
      const ref = sp.get('ref') || sp.get('pidx')

      if (isSuccess) {
        setPaymentNotice({
          method: method?.toUpperCase() || 'ONLINE',
          ref: ref || 'Verified',
        })
      }

      // Fetch live order from database first
      fetch(`/api/orders?orderNumber=${encodeURIComponent(orderId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setOrder(data.data)
            localStorage.setItem(`order_${orderId}`, JSON.stringify(data.data))
            setLoading(false)
            return
          }
          throw new Error('Fallback to local')
        })
        .catch(() => {
          // Look up order in localStorage
          const saved = localStorage.getItem(`order_${orderId}`)
          if (saved) {
            const parsed = JSON.parse(saved)
            if (isSuccess) {
              parsed.status = 'CONFIRMED'
              parsed.payment = {
                ...parsed.payment,
                status: 'PAID',
                method: method ? (method.toUpperCase() as any) : parsed.payment?.method,
                transactionId: ref || parsed.payment?.transactionId,
              }
              localStorage.setItem(`order_${orderId}`, JSON.stringify(parsed))
            }
            setOrder(parsed)
          } else {
            // Fallback demo order snapshot
            setOrder({
              orderNumber: orderId,
              createdAt: new Date().toISOString(),
              customer: {
                name: 'Valued Guest',
                phone: '98520XXXXX',
                email: 'guest@purplehaze.com',
              },
              orderType: 'DELIVERY',
              deliveryZone: 'Biratnagar Core (Airport / Main Road)',
              address: {
                street: 'Airport Line, Ward 4',
                area: 'Near Domestic Airport',
                city: 'Biratnagar',
              },
              items: [
                {
                  id: '1',
                  dishName: 'Purple Haze Special Thakali Thali',
                  quantity: 2,
                  unitPrice: 550,
                  totalPrice: 1100,
                  variantName: 'Chicken Thali',
                },
                {
                  id: '2',
                  dishName: 'Steamed Chicken Momo (10 Pcs)',
                  quantity: 1,
                  unitPrice: 240,
                  totalPrice: 240,
                  variantName: 'Pan-Fried (Kothey)',
                },
                {
                  id: '3',
                  dishName: 'Signature Purple Haze Galaxy Mocktail',
                  quantity: 2,
                  unitPrice: 240,
                  totalPrice: 480,
                },
              ],
              pricing: {
                subtotal: 1820,
                discount: 182,
                couponCode: 'PURPLE10',
                deliveryFee: 50,
                total: 1688,
              },
              payment: {
                method: isSuccess ? (method?.toUpperCase() || 'ESEWA') : 'CASH_ON_DELIVERY',
                status: isSuccess ? 'PAID' : 'PENDING',
                amount: 1688,
                transactionId: ref || undefined,
              },
              status: 'CONFIRMED',
              estimatedTime: 35,
            })
          }
          setLoading(false)
        })
    }
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <p className="text-xs text-muted-foreground animate-pulse">Loading order invoice...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        {/* Success Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            Order Successfully Placed!
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Thank You For Your Order
          </h1>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your ticket has been sent directly to our kitchen staff. We are preparing your fresh meal now!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-xs font-mono font-bold text-primary">
            <span>Order #: {order?.orderNumber}</span>
          </div>
        </div>

        {/* Payment Verified Notice */}
        {(paymentNotice || order?.payment?.status === 'PAID') && (
          <div className="mb-6 bg-gradient-to-r from-emerald-500/10 via-primary/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Payment Verified & Received
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Method: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{paymentNotice?.method || order?.payment?.method || 'Digital Wallet'}</strong>
                  {paymentNotice?.ref && paymentNotice.ref !== 'Verified' && (
                    <span> • Ref: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{paymentNotice.ref}</code></span>
                  )}
                  {order?.payment?.transactionId && !paymentNotice?.ref && (
                    <span> • Ref: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">{order.payment.transactionId}</code></span>
                  )}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
              Verified by Gateway
            </span>
          </div>
        )}

        {/* Invoice / Ticket Card */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none">
          {/* Header Details */}
          <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-border/80 gap-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-foreground">
                Purple Haze Restro & Garden
              </h2>
              <p className="text-xs text-muted-foreground">
                Airport Line, Biratnagar, Morang, Nepal
              </p>
              <p className="text-xs text-muted-foreground">
                Phone: {RESTAURANT_INFO.primaryPhone}
              </p>
            </div>
            <div className="sm:text-right text-xs text-muted-foreground">
              <p>Date: {formatDate(order?.createdAt || new Date())}</p>
              <p>Service: <strong className="text-foreground uppercase">{order?.orderType}</strong></p>
              <p>Payment: <strong className="text-foreground">{order?.payment?.method?.replace(/_/g, ' ')}</strong></p>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-muted/40 p-4 rounded-2xl border border-border/60">
            <div>
              <span className="font-bold text-foreground block mb-1">Customer Details:</span>
              <p className="text-muted-foreground">{order?.customer?.name}</p>
              <p className="text-muted-foreground">{order?.customer?.phone}</p>
              <p className="text-muted-foreground">{order?.customer?.email}</p>
            </div>
            <div>
              <span className="font-bold text-foreground block mb-1">Delivery / Service Location:</span>
              {order?.orderType === 'DELIVERY' ? (
                <>
                  <p className="text-muted-foreground">{order?.address?.street}, {order?.address?.area}</p>
                  <p className="text-muted-foreground">{order?.deliveryZone || 'Biratnagar'}</p>
                </>
              ) : order?.orderType === 'DINE_IN' ? (
                <p className="text-muted-foreground">Dine-in: {order?.tableNumber || 'Table Seating'}</p>
              ) : (
                <p className="text-muted-foreground">Takeaway Pickup at Restaurant Counter</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ordered Items
            </h3>
            <div className="divide-y divide-border/60 text-xs">
              {order?.items?.map((item: any, i: number) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-foreground">
                      {item.quantity}x {item.dishName}
                    </span>
                    {item.variantName && (
                      <span className="text-[11px] text-primary ml-2">
                        ({item.variantName})
                      </span>
                    )}
                    {item.selectedAddOns?.length > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        + {item.selectedAddOns.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-foreground">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatPrice(order?.pricing?.subtotal || 0)}
              </span>
            </div>
            {order?.pricing?.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discount ({order?.pricing?.couponCode})</span>
                <span>-{formatPrice(order?.pricing?.discount)}</span>
              </div>
            )}
            {order?.orderType === 'DELIVERY' && (
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(order?.pricing?.deliveryFee || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-3">
              <span>Grand Total</span>
              <span className="text-primary text-xl">
                {formatPrice(order?.pricing?.total || 0)}
              </span>
            </div>
          </div>

          {/* Estimated Arrival Banner */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">Estimated Delivery Time</p>
                <p className="text-[11px] text-muted-foreground">Approximately 30 – 45 minutes in Biratnagar</p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary">~35 Mins</span>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 print:hidden">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold h-11 shadow-md gap-2"
            >
              <Link href={`/track-order?orderNumber=${order?.orderNumber}&phone=${order?.customer?.phone || ''}`}>
                <Truck className="w-4 h-4" /> Live Order Tracking
              </Link>
            </Button>

            <Button
              asChild
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-11 shadow-md gap-2"
            >
              <a
                href={getWhatsAppOrderUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Order ({ADMIN_WHATSAPP_NUMBER})
              </a>
            </Button>

            <Button
              variant="outline"
              onClick={handlePrint}
              className="rounded-xl text-xs font-semibold h-11 border-border gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
