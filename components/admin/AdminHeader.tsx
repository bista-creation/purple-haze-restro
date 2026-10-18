'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Search,
  Sparkles,
  Crown,
  ChefHat,
  ArrowUpRight,
  Menu,
  MessageCircle,
  Volume2,
  Database,
  RefreshCw,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { ADMIN_WHATSAPP_INTERNATIONAL, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp'

interface AdminHeaderProps {
  userRole?: 'ADMIN' | 'STAFF'
  userName?: string
  userEmail?: string
}

export function AdminHeader({
  userRole: propRole,
  userName: propName,
  userEmail: propEmail,
}: AdminHeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0)
  const [syncingDb, setSyncingDb] = useState(false)

  const handleSyncDb = async () => {
    try {
      setSyncingDb(true)
      const res = await fetch('/api/admin/sync-db', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        toast.success('Neon PostgreSQL Synced!', {
          description: `${data.stats.totalDishes} Dishes, ${data.stats.totalCategories} Categories, ${data.stats.totalOrders} Orders ready.`,
        })
      } else {
        toast.error(data.error || 'Database sync failed')
      }
    } catch {
      toast.error('Could not reach server to sync database.')
    } finally {
      setSyncingDb(false)
    }
  }

  const role = (propRole || session?.user?.role || 'ADMIN') as 'ADMIN' | 'STAFF'
  const name = propName || session?.user?.name || (role === 'ADMIN' ? 'Administrator' : 'Kitchen Staff')
  const email = propEmail || session?.user?.email || (role === 'ADMIN' ? 'admin@purplehaze.com' : 'staff@purplehaze.com')
  const isAdmin = role === 'ADMIN'

  // Poll for pending orders count
  useEffect(() => {
    const fetchOrderStats = () => {
      fetch('/api/orders')
        .then((res) => res.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data)) {
            const pending = d.data.filter(
              (o: any) => o.status === 'PLACED' || o.status === 'PREPARING'
            ).length
            setPendingOrdersCount(pending)
          }
        })
        .catch(() => {})
    }

    fetchOrderStats()
    const pollInterval = setInterval(fetchOrderStats, 8000)
    return () => clearInterval(pollInterval)
  }, [])

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)

    // Load initial avatar from session
    const currentEmail = email.toLowerCase()
    if (session?.user?.image) {
      setAvatarUrl(session.user.image)
    } else {
      setAvatarUrl(null)
    }

    try {
      const stored = localStorage.getItem('user_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.email && parsed.email.toLowerCase() === currentEmail) {
          if (parsed.image) setAvatarUrl(parsed.image)
        }
      }
    } catch {}

    // Fetch from API
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const activeImg = data.user.image || session?.user?.image || null
          setAvatarUrl(activeImg)
        }
      })
      .catch(() => {})

    // Listen to profile updates
    const handleProfileUpdate = (e: any) => {
      if (!e.detail?.email || e.detail.email.toLowerCase() === currentEmail) {
        if (e.detail?.image !== undefined) {
          setAvatarUrl(e.detail.image || session?.user?.image || null)
        }
      }
    }
    window.addEventListener('profile_updated', handleProfileUpdate)

    return () => {
      clearInterval(timer)
      window.removeEventListener('profile_updated', handleProfileUpdate)
    }
  }, [session, email])

  const handleSignOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_session')
      }
      await signOut({ callbackUrl: '/login' })
      toast.success('Signed out successfully.')
    } catch {
      router.push('/login')
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border px-3 sm:px-6 flex items-center justify-between shrink-0 transition-colors">
      {/* Left: Mobile Drawer Trigger + Brand / Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl text-foreground hover:bg-muted"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r border-purple-900/40 w-72 max-w-[85vw] bg-charcoal-950 text-white"
          >
            <AdminSidebar
              userRole={role}
              userName={name}
              userEmail={email}
              isMobileDrawer
              onClose={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
          Biratnagar HQ • Airport Road Line
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-primary border border-purple-500/20">
          Branch #01
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* Direct WhatsApp Manager Hotline */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-1.5 h-9 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold"
          title={`WhatsApp Alerts & Dispatch: ${ADMIN_WHATSAPP_NUMBER}`}
        >
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP_INTERNATIONAL}?text=Hello%20Purple%20Haze%20Manager,%20inquiry%20from%20admin%20portal`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">WhatsApp</span>
            <span className="font-mono text-[11px]">{ADMIN_WHATSAPP_NUMBER}</span>
          </a>
        </Button>

        {/* Sync Neon DB (Admin only) */}
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncDb}
            disabled={syncingDb}
            className="hidden lg:flex items-center gap-1.5 h-9 rounded-xl border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 text-xs font-semibold"
            title="Populate and verify Neon PostgreSQL database catalog"
          >
            <Database className={`w-3.5 h-3.5 text-purple-500 ${syncingDb ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline">{syncingDb ? 'Syncing...' : 'Sync Neon DB'}</span>
          </Button>
        )}

        {/* Role Badge in Header */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted border border-border text-xs font-bold">
          {isAdmin ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-foreground">Full Admin Access</span>
            </>
          ) : (
            <>
              <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-foreground">Kitchen Staff Mode</span>
            </>
          )}
        </div>

        {/* Real-time Clock */}
        <div
          suppressHydrationWarning
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs font-mono font-semibold text-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span suppressHydrationWarning>{mounted && currentTime ? currentTime : '12:00:00 PM'}</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full w-9 h-9"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-gold-400" />
          ) : (
            <Moon className="w-4 h-4 text-primary" />
          )}
        </Button>

        {/* Live Notifications Indicator with Pending Orders Count */}
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="relative rounded-full w-9 h-9"
          aria-label="View Orders"
        >
          <Link href="/admin/orders">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </Link>
        </Button>

        {/* User Account & Sign Out Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-1 sm:px-2 rounded-xl hover:bg-muted"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-xs"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                    isAdmin
                      ? 'bg-gradient-to-br from-amber-500 to-purple-800'
                      : 'bg-gradient-to-br from-emerald-600 to-indigo-800'
                  }`}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-foreground block leading-tight">
                  {name}
                </span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
            <div className="px-3 py-2 border-b border-border/60">
              <p className="text-xs font-bold text-foreground">{name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{email}</p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  isAdmin
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                {isAdmin ? '👑 Executive Admin' : '👨‍🍳 Staff Operator'}
              </span>
            </div>

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs my-1">
              <Link href="/profile" className="flex items-center justify-between">
                <span>Profile & Photo Settings</span>
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs my-1">
              <a
                href={`https://wa.me/${ADMIN_WHATSAPP_INTERNATIONAL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold"
              >
                <span>WhatsApp: {ADMIN_WHATSAPP_NUMBER}</span>
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-xl cursor-pointer text-xs my-1">
              <Link href="/" target="_blank" className="flex items-center justify-between">
                <span>View Public Restro</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>

            {isAdmin && (
              <DropdownMenuItem
                onClick={handleSyncDb}
                disabled={syncingDb}
                className="rounded-xl cursor-pointer text-xs my-1 flex items-center justify-between text-purple-600 dark:text-purple-400 font-semibold"
              >
                <span>{syncingDb ? 'Syncing with Neon...' : 'Sync Neon Database'}</span>
                <Database className={`w-3.5 h-3.5 ${syncingDb ? 'animate-spin' : ''}`} />
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-xl cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-500/10 font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
