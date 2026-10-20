'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  Sparkles,
  UtensilsCrossed,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Eye,
  Crown,
  ChefHat,
  Camera,
  Settings,
  Tag,
  ShieldCheck,
  Plus,
  UserPlus,
  MessageCircle,
  RefreshCw,
} from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { getWhatsAppOrderUrl, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp'

export default function AdminOverviewPage() {
  const { data: session } = useSession()

  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('ADMIN')
  const [userName, setUserName] = useState<string>('Administrator')
  const [totalCatalogDishes, setTotalCatalogDishes] = useState<number>(24)
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('all')
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('')

  useEffect(() => {
    let activeRole: 'ADMIN' | 'STAFF' = (session?.user?.role as any) || 'ADMIN'
    let activeName = session?.user?.name || (activeRole === 'ADMIN' ? 'Administrator' : 'Kitchen Staff')
    try {
      const stored = localStorage.getItem('user_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.role) activeRole = parsed.role
        if (parsed.name) activeName = parsed.name
        else if (parsed.email) activeName = parsed.email.split('@')[0]
      }
    } catch {
      // Ignore
    }
    setRole(activeRole)
    setUserName(activeName)
  }, [session])

  const isAdmin = role === 'ADMIN'

  // Fetch menu dish count
  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.dishes)) {
          setTotalCatalogDishes(d.dishes.length)
        }
      })
      .catch(() => {})
  }, [])

  // Fetch real live orders
  const loadLiveOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data)
          setLastRefreshedAt(
            new Date().toLocaleTimeString('en-US', {
              timeZone: 'Asia/Kathmandu',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }) + ' NPT'
          )
        }
      })
      .catch((err) => {
        console.warn('Error fetching overview orders:', err)
      })
      .finally(() => {
        setLoadingOrders(false)
      })
  }

  useEffect(() => {
    loadLiveOrders()
    const interval = setInterval(loadLiveOrders, 8000)
    return () => clearInterval(interval)
  }, [])

  // Filter orders by date range
  const now = new Date()
  const filteredOrders = orders.filter((o) => {
    if (dateRange === 'all') return true
    const oDate = new Date(o.createdAt || o.updatedAt || 0)
    if (isNaN(oDate.getTime())) return true
    const diffMs = now.getTime() - oDate.getTime()
    if (dateRange === 'today') {
      return (
        oDate.getDate() === now.getDate() &&
        oDate.getMonth() === now.getMonth() &&
        oDate.getFullYear() === now.getFullYear()
      )
    }
    if (dateRange === '7d') return diffMs <= 7 * 24 * 60 * 60 * 1000
    if (dateRange === '30d') return diffMs <= 30 * 24 * 60 * 60 * 1000
    return true
  })

  // Calculate dynamic metrics strictly from real orders in selected date range
  // Net fulfilled sales excludes cancelled orders
  const netFulfilledRevenue = filteredOrders
    .filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED')
    .reduce((acc, o) => {
      const val = o.pricing?.total || o.totalAmount || o.total || 0
      return acc + Number(val)
    }, 0)

  // Gross active volume (including all confirmed & preparing tickets, excluding cancelled)
  const grossActiveRevenue = filteredOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => {
      const val = o.pricing?.total || o.totalAmount || o.total || 0
      return acc + Number(val)
    }, 0)

  // Kitchen queue: all orders in preparation/delivery pipeline
  const activeOrdersCount = filteredOrders.filter((o) =>
    ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)
  ).length

  const completedOrdersCount = filteredOrders.filter(
    (o) => o.status === 'DELIVERED' || o.status === 'COMPLETED'
  ).length

  const cancelledOrdersCount = filteredOrders.filter((o) => o.status === 'CANCELLED').length

  // Live recent orders (top 6)
  const recentOrders = filteredOrders.slice(0, 6).map((o) => {
    const id = o.orderNumber || o.id
    const customer = o.customer?.name || o.guestName || 'Valued Guest'
    const phone = o.customer?.phone || o.guestPhone || ''
    const type = o.orderType || 'DELIVERY'
    const total = o.pricing?.total || o.totalAmount || o.total || 0
    const status = o.status || 'PLACED'
    const itemsCount = Array.isArray(o.items) ? o.items.length : 1
    const createdAt = o.createdAt || new Date().toISOString()
    return {
      id,
      customer,
      phone,
      type,
      total,
      status,
      itemsCount,
      createdAt,
      raw: o,
    }
  })

  // Dynamically calculate dish rankings from real order item records
  const dishSalesMap = new Map<string, { name: string; sold: number; revenue: number; category: string }>()
  for (const ord of filteredOrders) {
    if (ord.status === 'CANCELLED') continue
    if (Array.isArray(ord.items)) {
      for (const it of ord.items) {
        const dishName = it.dishName || it.name || 'Special Dish'
        const qty = Number(it.quantity) || 1
        const lineTotal = Number(it.totalPrice) || (Number(it.unitPrice) || 0) * qty
        const existing = dishSalesMap.get(dishName)
        if (existing) {
          existing.sold += qty
          existing.revenue += lineTotal
        } else {
          dishSalesMap.set(dishName, {
            name: dishName,
            sold: qty,
            revenue: lineTotal,
            category: it.variantName || 'Kitchen Order',
          })
        }
      }
    }
  }

  const liveRankedDishes = Array.from(dishSalesMap.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)

  const isLiveDishData = liveRankedDishes.length > 0

  // Benchmark reference profiles shown only when no live dish items have been ordered yet
  const benchmarkDishes = [
    { name: 'Purple Haze Special Thakali Thali', sold: 184, revenue: 101200, category: 'Nepali' },
    { name: 'Steamed & Kothey Chicken Momo', sold: 242, revenue: 58080, category: 'Nepali' },
    { name: 'Old Delhi Butter Chicken', sold: 112, revenue: 54880, category: 'Indian' },
    { name: 'Wood-Fired Supreme Pizza', sold: 76, revenue: 51680, category: 'Italian' },
    { name: 'Signature Purple Galaxy Mocktail', sold: 198, revenue: 47520, category: 'Beverages' },
  ]

  const displayDishes = isLiveDishData ? liveRankedDishes : benchmarkDishes

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderId, status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Order #${orderId} marked as ${newStatus.replace(/_/g, ' ')}`)
        loadLiveOrders()
      } else {
        toast.error('Failed to update status.')
      }
    } catch {
      toast.error('Network error updating status.')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Role-Aware Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-purple-950/20 to-charcoal-900 border border-purple-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 text-amber-400" /> Executive Administrator
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ChefHat className="w-3.5 h-3.5 text-emerald-400" /> Kitchen Staff Operations
              </span>
            )}
            <span className="text-xs text-muted-foreground font-mono">
              Airport Line • Biratnagar
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            {isAdmin
              ? 'Complete operational control of menus, prices, dishes, event banquet inquiries, and staff permissions.'
              : 'Kitchen dispatch workstation. Review incoming live ticket orders and update preparation status.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin ? (
            <>
              <Button asChild size="sm" className="rounded-xl text-xs font-bold bg-primary hover:bg-primary-700 text-white gap-1.5 h-9">
                <Link href="/admin/menu">
                  <Plus className="w-3.5 h-3.5" /> Add New Dish
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-1.5 border-border h-9">
                <Link href="/admin/users">
                  <UserPlus className="w-3.5 h-3.5" /> Staff Access
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-xl text-xs font-bold bg-primary hover:bg-primary-700 text-white gap-1.5 h-9">
              <Link href="/admin/orders">
                <ShoppingBag className="w-3.5 h-3.5" /> Open Kitchen Queue
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 h-9"
          >
            <a
              href={`https://wa.me/977${ADMIN_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp {ADMIN_WHATSAPP_NUMBER}
            </a>
          </Button>
        </div>
      </div>

      {/* Live Data Controls & Data Freshness Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Time Period:</span>
          {(['today', '7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === r
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              {r === 'today' ? 'Today' : r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {lastRefreshedAt ? `Fresh as of ${lastRefreshedAt}` : 'Neon DB Connected'}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={loadLiveOrders}
            className="h-8 px-2.5 rounded-lg text-xs gap-1 hover:bg-muted"
            title="Refresh Live Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-primary' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Orders */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Order Volume
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {filteredOrders.length} Orders
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> {completedOrdersCount} fulfilled
              </span>
              {cancelledOrdersCount > 0 && (
                <span className="text-destructive font-medium">
                  • {cancelledOrdersCount} cancelled
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Live Active Kitchen Queue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Kitchen Pipeline
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {activeOrdersCount} Active
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2">
              <Clock className="w-3.5 h-3.5 animate-spin" /> In Preparation / Delivery
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        {/* Menu Items Count */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Active Dish Catalog
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {totalCatalogDishes} Recipes
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-2">
              <UtensilsCrossed className="w-3.5 h-3.5" /> 4 Cuisines in Stock
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        {/* Net Fulfilled Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Net Fulfilled Sales
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
              {formatPrice(netFulfilledRevenue)}
            </p>
            <span className="text-[10px] text-muted-foreground block mt-1">
              Gross pipeline: {formatPrice(grossActiveRevenue)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Orders & Top Dishes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Orders Queue */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Live Kitchen Order Queue
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time tickets placed via Biratnagar online delivery and dine-in.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1 border-border">
              <Link href="/admin/orders">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {loadingOrders ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
              Loading live kitchen orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No orders placed yet. As customers order from the menu, tickets appear here in real-time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order) => {
                    const waUrl = getWhatsAppOrderUrl(order.raw || order)

                    return (
                      <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-bold text-foreground">
                          #{order.id}
                        </td>
                        <td className="py-3.5 px-2">
                          <p className="font-semibold text-foreground">{order.customer}</p>
                          <p className="text-[10px] text-muted-foreground">{order.phone || 'No phone'}</p>
                        </td>
                        <td className="py-3.5 px-2 font-medium">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-foreground">
                            {order.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 font-bold text-foreground">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'DELIVERED' || order.status === 'COMPLETED'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : order.status === 'PREPARING'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                                : order.status === 'PLACED'
                                ? 'bg-rose-500/10 text-rose-600'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp button */}
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                              title="Send WhatsApp Alert"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {order.status === 'PLACED' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-2 font-bold"
                              >
                                Cook
                              </Button>
                            )}
                            {order.status === 'PREPARING' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                                className="h-7 text-[10px] bg-primary hover:bg-primary-700 text-white rounded-lg px-2 font-bold"
                              >
                                Ready
                              </Button>
                            )}
                            {(order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY') && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2 font-bold"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Dishes */}
        <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Top Selling Dishes
              </h3>
              {isLiveDishData ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  ● Live Data
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                  Sample Benchmark
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              {isLiveDishData
                ? `Rankings computed from ${filteredOrders.length} orders in selected time period.`
                : 'No live order items recorded in this period yet. Showing baseline menu popularity for prep.'}
            </p>

            <div className="space-y-4">
              {displayDishes.map((dish, i) => (
                <div key={dish.name} className="flex items-center justify-between text-xs pb-3 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-muted text-muted-foreground font-bold flex items-center justify-center text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground line-clamp-1">{dish.name}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        {dish.sold} ordered • {dish.category}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground whitespace-nowrap">
                    {formatPrice(dish.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full text-xs font-bold rounded-xl gap-2 border-border h-9">
                <Link href="/admin/menu">
                  <UtensilsCrossed className="w-4 h-4 text-primary" /> Manage Dish Catalog
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
