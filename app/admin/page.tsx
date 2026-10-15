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
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function AdminOverviewPage() {
  const { data: session } = useSession()

  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('ADMIN')
  const [userName, setUserName] = useState<string>('Administrator')

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

  const [totalCatalogDishes, setTotalCatalogDishes] = useState<number>(24)

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

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'PH261014A3F2',
      customer: 'Ramesh KC',
      phone: '9852022202',
      type: 'DELIVERY',
      total: 1688,
      status: 'PREPARING',
      time: '12 mins ago',
      itemsCount: 3,
    },
    {
      id: 'PH261014B92X',
      customer: 'Sushil Thapa',
      phone: '9841537347',
      type: 'DINE_IN',
      total: 2150,
      status: 'PLACED',
      time: '18 mins ago',
      itemsCount: 4,
    },
    {
      id: 'PH261014C49Q',
      customer: 'Pooja Agrawal',
      phone: '9802770202',
      type: 'PICKUP',
      total: 820,
      status: 'READY_FOR_PICKUP',
      time: '34 mins ago',
      itemsCount: 2,
    },
    {
      id: 'PH261014D88K',
      customer: 'Deepak Subedi',
      phone: '9842011111',
      type: 'DELIVERY',
      total: 1450,
      status: 'DELIVERED',
      time: '1 hour ago',
      itemsCount: 3,
    },
    {
      id: 'PH261014E12V',
      customer: 'Anup Sharma',
      phone: '9852099999',
      type: 'DELIVERY',
      total: 3400,
      status: 'DELIVERED',
      time: '2 hours ago',
      itemsCount: 6,
    },
  ])

  const topDishes = [
    { name: 'Purple Haze Special Thakali Thali', sold: 184, revenue: 101200, category: 'Nepali' },
    { name: 'Steamed & Kothey Chicken Momo', sold: 242, revenue: 58080, category: 'Nepali' },
    { name: 'Old Delhi Butter Chicken', sold: 112, revenue: 54880, category: 'Indian' },
    { name: 'Wood-Fired Supreme Pizza', sold: 76, revenue: 51680, category: 'Italian' },
    { name: 'Signature Purple Galaxy Mocktail', sold: 198, revenue: 47520, category: 'Beverages' },
  ]

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setRecentOrders(
      recentOrders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    toast.success(`Order ${id} updated to ${newStatus}`)
  }

  return (
    <div className="space-y-8">
      {/* Role-Aware Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-purple-950/20 to-charcoal-900 border border-purple-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
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

          <h1 className="font-serif text-3xl font-bold text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl font-medium">
            {isAdmin
              ? 'You have complete administrative authority to customize the menu, update food photography, adjust prices, manage promotions, and oversee all restaurant operations.'
              : 'Kitchen and service station view. Monitor incoming customer tickets, update meal preparation progress, and toggle live ingredient availability.'}
          </p>
        </div>

        {/* Quick Action Buttons according to Role */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin ? (
            <>
              <Button asChild className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold gap-2 shadow-sm h-10 px-4">
                <Link href="/admin/menu">
                  <Camera className="w-4 h-4 text-gold-300" /> Customize Menu & Photos
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-xs font-bold rounded-xl h-10 border-border gap-1.5">
                <Link href="/admin/users">
                  <UserPlus className="w-4 h-4 text-amber-500" /> Team & Staff
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-xs font-bold rounded-xl h-10 border-border gap-1.5">
                <Link href="/admin/orders">
                  <ShoppingBag className="w-4 h-4" /> Live Orders
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold gap-2 shadow-sm h-10 px-4">
                <Link href="/admin/orders">
                  <ShoppingBag className="w-4 h-4" /> Kitchen Order Queue
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-xs font-bold rounded-xl h-10 border-border gap-1.5">
                <Link href="/admin/menu">
                  <UtensilsCrossed className="w-4 h-4" /> Toggle Stock (86)
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Today&apos;s Revenue
            </span>
            <p className="font-serif text-2xl font-bold text-foreground">
              {formatPrice(48650)}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs yesterday
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Active Orders Today
            </span>
            <p className="font-serif text-2xl font-bold text-foreground">
              {recentOrders.length} In-Queue
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-2">
              <Clock className="w-3.5 h-3.5" /> Avg prep: 22 mins
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Menu Catalog Dishes
            </span>
            <p className="font-serif text-2xl font-bold text-foreground">
              {totalCatalogDishes} Recipes
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2">
              <Camera className="w-3.5 h-3.5" /> With HD Photos
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Staff on Duty
            </span>
            <p className="font-serif text-2xl font-bold text-foreground">
              8 Kitchen & Floor
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> All shifts active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Orders & Top Dishes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Queue */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-foreground">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="font-semibold text-foreground">{order.customer}</p>
                      <p className="text-[10px] text-muted-foreground">{order.phone}</p>
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
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : order.status === 'PREPARING'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                            : order.status === 'READY_FOR_PICKUP'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {order.status === 'PLACED' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          className="h-7 text-[10px] bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-2 font-bold"
                        >
                          Start Prep
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                          className="h-7 text-[10px] bg-primary hover:bg-primary-700 text-white rounded-lg px-2 font-bold"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'READY_FOR_PICKUP' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                          className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2 font-bold"
                        >
                          Dispatch
                        </Button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Dishes */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">
              Top Selling Dishes
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Highest-grossing menu items in Biratnagar branch.
            </p>

            <div className="space-y-4">
              {topDishes.map((dish, i) => (
                <div key={dish.name} className="flex items-center justify-between text-xs pb-3 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-muted text-muted-foreground font-bold flex items-center justify-center text-[11px]">
                      #{i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-foreground line-clamp-1">{dish.name}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        {dish.sold} orders • {dish.category}
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
              <Button asChild variant="outline" className="w-full text-xs font-bold rounded-xl gap-2 border-border">
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
