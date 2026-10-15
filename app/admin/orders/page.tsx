'use client'

import React, { useState } from 'react'
import {
  ShoppingBag,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  XCircle,
  Eye,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AdminOrdersPage() {
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const [orders, setOrders] = useState([
    {
      id: 'PH261014A3F2',
      customer: 'Ramesh KC',
      phone: '9852022202',
      email: 'ramesh@example.com',
      orderType: 'DELIVERY',
      status: 'PREPARING',
      deliveryAddress: 'Airport Line, Ward 4, Near Airport',
      subtotal: 1638,
      deliveryFee: 50,
      total: 1688,
      createdAt: new Date().toISOString(),
      items: [
        { dishName: 'Purple Haze Special Thakali Thali', quantity: 2, variant: 'Chicken Thali', price: 1100 },
        { dishName: 'Steamed Chicken Momo', quantity: 1, variant: 'Kothey', price: 270 },
        { dishName: 'Signature Purple Galaxy Mocktail', quantity: 1, price: 240 },
      ],
      notes: 'Extra spicy tomato achar please.',
    },
    {
      id: 'PH261014B92X',
      customer: 'Sushil Thapa',
      phone: '9841537347',
      email: 'sushil@example.com',
      orderType: 'DINE_IN',
      status: 'PLACED',
      tableNumber: 'Garden Pergola 2',
      subtotal: 2150,
      deliveryFee: 0,
      total: 2150,
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      items: [
        { dishName: 'Wood-Fired Purple Haze Supreme Pizza', quantity: 2, variant: '12 inch Large', price: 1360 },
        { dishName: 'Szechuan Chicken Hakka Chowmein', quantity: 1, price: 320 },
        { dishName: 'Garden Fresh Mint & Lemon Mojito', quantity: 2, price: 380 },
      ],
    },
    {
      id: 'PH261014C49Q',
      customer: 'Pooja Agrawal',
      phone: '9802770202',
      email: 'pooja@example.com',
      orderType: 'PICKUP',
      status: 'READY_FOR_PICKUP',
      subtotal: 820,
      deliveryFee: 0,
      total: 820,
      createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
      items: [
        { dishName: 'Hyderabadi Dum Biryani (Mutton)', quantity: 1, price: 650 },
        { dishName: 'Crispy Mustang Aloo Sandeko', quantity: 1, price: 220 },
      ],
    },
  ])

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false
    if (filterType !== 'all' && o.orderType !== filterType) return false
    return true
  })

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    toast.success(`Order ${id} marked as ${newStatus.replace(/_/g, ' ')}`)
  }

  const printKitchenTicket = (order: any) => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Kitchen & Delivery Flow
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Live Orders Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSoundAlerts(!soundAlerts)
              toast.info(soundAlerts ? 'Sound alerts muted.' : 'Sound alerts enabled.')
            }}
            className="rounded-xl text-xs gap-1.5 border-border"
          >
            {soundAlerts ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> Sound Alert On
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" /> Muted
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === st
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-card text-xs font-semibold text-foreground rounded-xl border border-border px-3 py-1.5 outline-none focus:border-primary"
          >
            <option value="all">All Service Types</option>
            <option value="DELIVERY">Delivery Only</option>
            <option value="PICKUP">Takeaway Pickup</option>
            <option value="DINE_IN">Dine-In Tables</option>
          </select>
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <span className="font-mono text-base font-bold text-foreground block">
                    {order.id}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'PLACED'
                      ? 'bg-red-500/10 text-red-600 animate-pulse'
                      : order.status === 'PREPARING'
                      ? 'bg-gold-500/10 text-gold-600'
                      : order.status === 'DELIVERED'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Customer & Location */}
              <div className="py-2.5 text-xs space-y-1">
                <p className="font-bold text-foreground">
                  {order.customer} • <span className="font-normal text-muted-foreground">{order.phone}</span>
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {order.orderType === 'DELIVERY'
                    ? `📍 ${order.deliveryAddress}`
                    : order.orderType === 'DINE_IN'
                    ? `🍽️ ${order.tableNumber}`
                    : '🛍️ Takeaway Counter Pickup'}
                </p>
                {order.notes && (
                  <p className="p-2 rounded-lg bg-gold-500/10 text-gold-800 dark:text-gold-300 text-[10px] font-medium">
                    Note: {order.notes}
                  </p>
                )}
              </div>

              {/* Items List */}
              <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
                {order.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      <strong className="text-foreground">{it.quantity}x</strong> {it.dishName}
                      {it.variant && <span className="text-[10px] text-primary ml-1">({it.variant})</span>}
                    </span>
                    <span className="font-semibold">{formatPrice(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with status triggers and print */}
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="text-base font-bold text-primary">{formatPrice(order.total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {order.status === 'PLACED' && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, 'PREPARING')}
                    className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs h-9"
                  >
                    Accept & Cook
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateStatus(
                        order.id,
                        order.orderType === 'PICKUP' ? 'READY_FOR_PICKUP' : 'OUT_FOR_DELIVERY'
                      )
                    }
                    className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs h-9"
                  >
                    Mark Ready
                  </Button>
                )}
                {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_PICKUP') && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order.id, 'DELIVERED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9"
                  >
                    Complete Order
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printKitchenTicket(order)}
                  className="rounded-xl text-xs h-9 border-border gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Ticket
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
