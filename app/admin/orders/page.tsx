'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  MessageCircle,
  RefreshCw,
  ChefHat,
  Sparkles,
} from 'lucide-react'
import { formatPrice, formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { getWhatsAppOrderUrl, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp'

export default function AdminOrdersPage() {
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const knownOrderIds = useRef<Set<string>>(new Set())
  const isFirstLoad = useRef(true)

  // Restore staff sound alert preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_orders_sound')
      if (saved !== null) {
        setSoundAlerts(saved === 'true')
      }
    } catch {}
  }, [])

  const handleToggleSound = () => {
    const next = !soundAlerts
    setSoundAlerts(next)
    try {
      localStorage.setItem('admin_orders_sound', String(next))
    } catch {}
    toast.info(next ? 'Kitchen order audio chime enabled.' : 'Kitchen order audio chime muted.')
  }

  // Web Audio chime generator
  const playChime = useCallback(() => {
    if (!soundAlerts) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.35)
    } catch {}
  }, [soundAlerts])

  // Fetch orders from API
  const fetchOrders = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`)
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setConnectionError(null)
        const rawOrders = data.data

        // Detect new incoming orders after initial load
        if (!isFirstLoad.current && knownOrderIds.current.size > 0) {
          const incomingNew = rawOrders.filter(
            (o: any) => !knownOrderIds.current.has(o.orderNumber || o.id)
          )
          if (incomingNew.length > 0) {
            playChime()
            incomingNew.forEach((no: any) => {
              const name = no.customer?.name || no.guestName || 'Guest'
              const amt = no.pricing?.total || no.totalAmount || no.total || 0
              toast.success(`🔔 New Order #${no.orderNumber || no.id} received!`, {
                description: `${name} ordered for NPR ${amt}`,
              })
            })
          }
        }

        // Update known IDs
        rawOrders.forEach((o: any) => {
          knownOrderIds.current.add(o.orderNumber || o.id)
        })
        isFirstLoad.current = false

        // Normalize orders structure
        const normalized = rawOrders.map((o: any) => {
          const id = o.orderNumber || o.id
          const customer = o.customer?.name || o.guestName || 'Valued Guest'
          const phone = o.customer?.phone || o.guestPhone || ''
          const email = o.customer?.email || o.guestEmail || ''
          const orderType = o.orderType || 'DELIVERY'
          const status = o.status || 'PLACED'
          const total = o.pricing?.total || o.totalAmount || o.total || 0
          const subtotal = o.pricing?.subtotal || o.subtotal || 0
          const deliveryFee = o.pricing?.deliveryFee || o.deliveryFee || 0
          const address = o.address || o.deliveryAddress
          const addressStr = address
            ? typeof address === 'string'
              ? address
              : `${address.street || ''}, ${address.area || ''}, ${address.city || ''}${
                  address.landmark ? ` (Near ${address.landmark})` : ''
                }`.replace(/^,\s*/, '')
            : 'Airport Line, Biratnagar'
          const items = Array.isArray(o.items)
            ? o.items.map((it: any) => ({
                dishName: it.dishName || it.name || 'Dish',
                quantity: it.quantity || 1,
                variant: it.variantName || it.variant || null,
                price: it.totalPrice || it.unitPrice * (it.quantity || 1) || it.price || 0,
              }))
            : []
          const notes = o.notes || o.orderNotes || ''

          return {
            id,
            raw: o,
            customer,
            phone,
            email,
            orderType,
            status,
            deliveryAddress: addressStr,
            tableNumber: o.tableNumber || 'Garden Area',
            subtotal,
            deliveryFee,
            total,
            createdAt: o.createdAt || new Date().toISOString(),
            items,
            notes,
          }
        })

        setOrders(normalized)
      } else {
        setConnectionError(data.error || 'Failed to parse orders response')
      }
    } catch (err: any) {
      console.warn('Could not fetch live orders:', err)
      setConnectionError(err?.message || 'Connection lost to live queue. Retrying...')
    } finally {
      setLoading(false)
      if (manual) setRefreshing(false)
    }
  }, [playChime])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => fetchOrders(), 6000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false
    if (filterType !== 'all' && o.orderType !== filterType) return false
    return true
  })

  // Update order status live
  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderId, status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Order #${orderId} marked as ${newStatus.replace(/_/g, ' ')}`)
      } else {
        toast.error(data.error || 'Failed to update order status.')
        fetchOrders()
      }
    } catch {
      toast.error('Network error updating order.')
      fetchOrders()
    }
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
            Kitchen &amp; Delivery Flow
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Live Orders Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-refreshing every 6s • Audio chime: <strong className={soundAlerts ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}>{soundAlerts ? 'Active' : 'Muted'}</strong> (Preference saved)
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="rounded-xl text-xs gap-1.5 border-border h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSound}
            className="rounded-xl text-xs gap-1.5 border-border h-9"
          >
            {soundAlerts ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Chime Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Chime Muted</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Connection Failure Alert Banner */}
      {connectionError && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Live connection issue: {connectionError} (Retrying every 6s)</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchOrders(true)}
            className="h-7 text-[11px] border-destructive/40 hover:bg-destructive/10 rounded-lg shrink-0"
          >
            Retry Now
          </Button>
        </div>
      )}

      {/* Filter Tabs & Service Type Selector */}
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
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
            className="w-full sm:w-auto bg-card text-xs font-semibold text-foreground rounded-xl border border-border px-3 py-1.5 outline-none focus:border-primary h-9"
          >
            <option value="all">All Service Types</option>
            <option value="DELIVERY">Delivery Only</option>
            <option value="PICKUP">Takeaway Pickup</option>
            <option value="DINE_IN">Dine-In Tables</option>
          </select>
        </div>
      </div>

      {/* Orders Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-muted-foreground bg-card border border-border rounded-3xl">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2 opacity-60" />
          Loading live orders from database &amp; kitchen queue...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center text-xs text-muted-foreground bg-card border border-border rounded-3xl">
          <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
          <h3 className="font-bold text-foreground text-sm mb-1">No orders in this queue</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            New customer orders submitted via checkout or payment gateway will show up here automatically with audio alerts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((order) => {
            const waUrl = getWhatsAppOrderUrl(order.raw || order)

            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  {/* Card Header: Order Number & Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/70">
                    <div>
                      <span className="font-mono text-base font-bold text-foreground block">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'PLACED'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                          : order.status === 'PREPARING'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : order.status === 'DELIVERED' || order.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-primary/15 text-primary border border-primary/30'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer, Phone & Delivery Info */}
                  <div className="py-2.5 text-xs space-y-1">
                    <p className="font-bold text-foreground">
                      {order.customer} •{' '}
                      <a href={`tel:${order.phone}`} className="font-normal text-primary hover:underline">
                        {order.phone || 'No phone'}
                      </a>
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {order.orderType === 'DELIVERY'
                        ? `📍 ${order.deliveryAddress}`
                        : order.orderType === 'DINE_IN'
                        ? `🍽️ Table: ${order.tableNumber}`
                        : '🛍️ Takeaway Counter Pickup'}
                    </p>
                    {order.notes && (
                      <p className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-medium leading-relaxed">
                        Note: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
                    {order.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between items-start gap-2">
                        <span className="leading-snug">
                          <strong className="text-foreground">{it.quantity}x</strong> {it.dishName}
                          {it.variant && (
                            <span className="text-[10px] text-primary ml-1 font-medium">
                              ({it.variant})
                            </span>
                          )}
                        </span>
                        <span className="font-semibold text-foreground shrink-0">
                          {formatPrice(it.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: WhatsApp Button, Total & Workflow Buttons */}
                <div className="pt-3 border-t border-border space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Grand Total:</span>
                    <span className="text-base font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>

                  {/* Direct WhatsApp to 9851150987 Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Order to {ADMIN_WHATSAPP_NUMBER}</span>
                  </a>

                  {/* Status Progression Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {order.status === 'PLACED' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs h-9 font-semibold"
                      >
                        Accept &amp; Cook
                      </Button>
                    )}

                    {order.status === 'PREPARING' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus(
                            order.id,
                            order.orderType === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'READY_FOR_PICKUP'
                          )
                        }
                        className="bg-amber-500 hover:bg-amber-600 text-charcoal-950 rounded-xl text-xs h-9 font-bold"
                      >
                        {order.orderType === 'DELIVERY' ? 'Dispatch Rider' : 'Ready for Counter'}
                      </Button>
                    )}

                    {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'READY_FOR_PICKUP') && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9 font-semibold"
                      >
                        Mark Delivered
                      </Button>
                    )}

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="rounded-xl text-xs h-9 text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => printKitchenTicket(order)}
                      className="rounded-xl text-xs h-9 gap-1.5 border-border hover:bg-muted"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Ticket
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
