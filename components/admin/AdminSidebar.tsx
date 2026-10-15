'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Users,
  Tag,
  MessageSquare,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Sparkles,
  ChefHat,
  Crown,
  UserCog,
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface AdminSidebarProps {
  userRole?: 'ADMIN' | 'STAFF'
  userName?: string
  userEmail?: string
}

export function AdminSidebar({
  userRole: propRole,
  userName: propName,
  userEmail: propEmail,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Determine active role (from server prop or client session)
  const role = (propRole || session?.user?.role || 'ADMIN') as 'ADMIN' | 'STAFF'
  const isAdmin = role === 'ADMIN'

  const navItems = [
    {
      href: '/admin',
      label: 'Overview & Stats',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      href: '/admin/orders',
      label: 'Live Orders Queue',
      icon: ShoppingBag,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white',
      roles: ['ADMIN', 'STAFF'],
    },
    {
      href: '/admin/menu',
      label: 'Menu & Dishes',
      icon: UtensilsCrossed,
      badge: isAdmin ? 'Full Custom' : 'Stock',
      badgeColor: isAdmin ? 'bg-purple-600 text-white' : 'bg-neutral-700 text-neutral-200',
      roles: ['ADMIN', 'STAFF'],
    },
    {
      href: '/admin/events',
      label: 'Events & Venues',
      icon: Calendar,
      roles: ['ADMIN', 'STAFF'],
    },
    {
      href: '/admin/reviews',
      label: 'Reviews & Feedback',
      icon: MessageSquare,
      roles: ['ADMIN', 'STAFF'],
    },
    // Admin Exclusive Sections
    {
      href: '/admin/users',
      label: 'Team & Staff Access',
      icon: UserCog,
      badge: 'Access',
      badgeColor: 'bg-amber-500 text-charcoal-950',
      adminOnly: true,
      roles: ['ADMIN'],
    },
    {
      href: '/admin/customers',
      label: 'Customer Directory',
      icon: Users,
      adminOnly: true,
      roles: ['ADMIN'],
    },
    {
      href: '/admin/promotions',
      label: 'Coupons & Promos',
      icon: Tag,
      adminOnly: true,
      roles: ['ADMIN'],
    },
    {
      href: '/admin/settings',
      label: 'Restaurant Settings',
      icon: Settings,
      adminOnly: true,
      roles: ['ADMIN'],
    },
  ]

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false
    return pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-charcoal-950 text-purple-100 flex flex-col justify-between border-r border-purple-900/40 shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-purple-900/40">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-800 flex items-center justify-center text-gold-400 shadow-md border border-gold-400/30">
              <UtensilsCrossed className="w-5 h-5 text-gold-300" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white block">
                Purple Haze
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-400 -mt-1 block">
                Biratnagar, Nepal
              </span>
            </div>
          </Link>

          {/* Role Status Pill */}
          <div className="mt-3 pt-3 border-t border-purple-900/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isAdmin ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Mode</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kitchen Staff</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-purple-300/70 font-mono">
              Airport Line
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            const isRestrictedForStaff = item.adminOnly && !isAdmin

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-900/50'
                    : isRestrictedForStaff
                    ? 'text-purple-300/50 hover:bg-purple-950/40 hover:text-purple-300'
                    : 'text-purple-200/80 hover:bg-purple-900/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      active
                        ? 'text-gold-300'
                        : isRestrictedForStaff
                        ? 'text-purple-400/40'
                        : 'text-purple-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.badgeColor || 'bg-gold-500 text-charcoal-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isRestrictedForStaff && (
                  <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-400/80 border border-purple-800/30">
                    <Lock className="w-2.5 h-2.5" /> Admin
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Return Link */}
      <div className="p-4 border-t border-purple-900/40 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-300 hover:text-white hover:bg-purple-900/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Website</span>
        </Link>
        <div className="px-3 py-1 flex items-center gap-1.5 text-[11px] text-purple-400/70">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
          <span>Role: {isAdmin ? 'Executive Admin' : 'Kitchen Staff'}</span>
        </div>
      </div>
    </aside>
  )
}
