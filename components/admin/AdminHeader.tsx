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
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

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

  const role = (propRole || session?.user?.role || 'ADMIN') as 'ADMIN' | 'STAFF'
  const name = propName || session?.user?.name || (role === 'ADMIN' ? 'Administrator' : 'Kitchen Staff')
  const email = propEmail || session?.user?.email || (role === 'ADMIN' ? 'admin@purplehaze.com' : 'staff@purplehaze.com')
  const isAdmin = role === 'ADMIN'

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

    // Load initial avatar from session (Google OAuth or Credentials)
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

    // Listen to profile updates for this specific user
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
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors">
      {/* Search & Location Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
          Biratnagar HQ • Airport Road Line
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-primary border border-purple-500/20">
          Branch #01
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Role Badge in Header */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted border border-border text-xs font-bold">
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

        {/* Live Notifications Indicator */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full w-9 h-9"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Button>

        {/* User Account & Sign Out Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 rounded-xl hover:bg-muted"
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
              <Link href="/" target="_blank" className="flex items-center justify-between">
                <span>View Public Restro</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </DropdownMenuItem>

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
