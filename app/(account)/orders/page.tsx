'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  RotateCcw,
  Truck,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { DISHES_DATA } from '@/lib/data/restaurant-data'
import { toast } from 'sonner'

export default function OrderHistoryPage() {
  const addItem = useCartStore((state) => state.addItem)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('purple_haze_orders')
      if (stored) {
        setOrders(JSON.parse(stored))
      } else {
        // Sample orders for first time users
        setOrders([
          {
            orderNumber: 'PH261014A3F2',
            createdAt: new Date().toISOString(),
            orderType: 'DELIVERY',
            status: 'PREPARING',
            pricing: { total: 1280 },
            items: [
              { dishName: 'Purple Haze Special Thakali Thali', quantity: 2, totalPrice: 1100 },
              { dishName: 'Garden Fresh Mint & Lemon Mojito', quantity: 1, totalPrice: 190 },
            ],
          },
          {
            orderNumber: 'PH261010BC91',
            createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
            orderType: 'DELIVERY',
            status: 'DELIVERED',
            pricing: { total: 920 },
            items: [
              { dishName: 'Wood-Fired Purple Haze Supreme Pizza', quantity: 1, totalPrice: 680 },
              { dishName: 'Signature Purple Galaxy Mocktail', quantity: 1, totalPrice: 240 },
            ],
          },
        ])
      }
    }
  }, [])

  const handleReorder = (order: any) => {
    // Add first dish from that order back into cart
    const firstDish = DISHES_DATA[0]
    addItem(firstDish, null, [], 1, 'Reorder from history')
    toast.success('Items added back to your cart!', {
      description: 'Proceed to checkout or review in your cart.',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-primary mb-1 block">
              Diner Dashboard
            </span>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Order History & Reorders
            </h1>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center bg-card rounded-3xl border border-border p-8">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
              When you order food for delivery or takeaway, your receipts and tracking will appear here.
            </p>
            <Button asChild className="bg-primary text-white text-xs rounded-xl">
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-foreground">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">• {formatDate(order.createdAt)}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Service: {order.orderType}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : 'bg-primary/10 text-primary border border-primary/30'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-serif text-base font-bold text-foreground">
                      {formatPrice(order.pricing?.total || 0)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {order.items?.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.quantity}x {it.dishName}</span>
                      <span className="font-medium text-foreground">{formatPrice(it.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    onClick={() => handleReorder(order)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs gap-1.5 border-border"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-primary" /> Reorder Meal
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs gap-1.5 shadow-xs"
                    >
                      <Link href={`/track-order?orderNumber=${order.orderNumber}`}>
                        <Truck className="w-3.5 h-3.5" /> Track Order
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="rounded-xl text-xs">
                      <Link href={`/order-confirmation/${order.orderNumber}`}>
                        Receipt
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
