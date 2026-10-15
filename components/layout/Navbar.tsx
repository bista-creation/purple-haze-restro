'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  Calendar,
  UtensilsCrossed,
  User,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  LogOut,
  MapPin,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  const itemCount = useCartStore((state) => state.getItemCount())
  const toggleCart = useCartStore((state) => state.toggleCart)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // If guest / not logged in, reset avatar and do not read localStorage
    if (!session?.user) {
      setUserAvatar(null)
      setUserName(null)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    const currentEmail = session.user.email?.toLowerCase()

    // 1. Initial hydrate from session (Google OAuth or Credentials)
    if (session.user.image) {
      setUserAvatar(session.user.image)
    } else {
      setUserAvatar(null)
    }
    if (session.user.name) setUserName(session.user.name)

    // 2. Check localStorage ONLY if stored session matches current user's email
    try {
      const stored = localStorage.getItem('user_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.email && currentEmail && parsed.email.toLowerCase() === currentEmail) {
          if (parsed.image) setUserAvatar(parsed.image)
          if (parsed.name) setUserName(parsed.name)
        } else if (parsed.email && currentEmail && parsed.email.toLowerCase() !== currentEmail) {
          // Stale cache from different user, purge it
          localStorage.removeItem('user_session')
        }
      }
    } catch {}

    // 3. Fetch latest from database API
    const fetchFreshAvatar = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.user) {
            const activeImg = data.user.image || session.user?.image || null
            setUserAvatar(activeImg)
            if (data.user.name) setUserName(data.user.name)
          }
        }
      } catch {}
    }
    fetchFreshAvatar()

    // 4. Reactive listener for avatar changes across tabs/components
    const handleProfileUpdated = (e: any) => {
      if (
        !e.detail?.email ||
        !currentEmail ||
        e.detail.email.toLowerCase() === currentEmail
      ) {
        if (e.detail?.image !== undefined) {
          setUserAvatar(e.detail.image || session.user?.image || null)
        }
        if (e.detail?.name) {
          setUserName(e.detail.name)
        }
      }
    }
    window.addEventListener('profile_updated', handleProfileUpdated)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('profile_updated', handleProfileUpdated)
    }
  }, [session])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/events', label: 'Events & Venues' },
    { href: '/reservations', label: 'Reservations' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-purple-950 text-purple-100 text-xs py-1.5 px-4 hidden md:block border-b border-purple-900/40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <MapPin className="w-3.5 h-3.5" /> Airport Line, Biratnagar, Nepal
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" /> {RESTAURANT_INFO.primaryPhone}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-purple-200">Open Today: 10:00 AM - 10:00 PM</span>
            <span className="text-purple-400">|</span>
            <Link
              href="/track-order"
              className="text-gold-400 hover:text-gold-300 transition-colors font-medium hover:underline"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border/60 py-2.5'
            : 'bg-background/80 backdrop-blur-sm border-b border-border/30 py-3.5'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 flex items-center justify-center text-gold-400 shadow-md group-hover:scale-105 transition-transform duration-300 border border-gold-400/30">
              <UtensilsCrossed className="w-5 h-5 text-gold-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Purple Haze
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700 dark:text-gold-400 -mt-1">
                Restro & Garden • Biratnagar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active
                      ? 'text-primary font-bold'
                      : 'text-foreground/80 hover:text-primary hover:bg-purple-100/60 dark:hover:bg-muted/50'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-gold-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Action CTAs & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full w-9 h-9 text-foreground/80 hover:text-foreground hover:bg-muted"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-gold-400" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )}
              </Button>
            )}

            {/* Cart Button */}
            <Button
              onClick={toggleCart}
              variant="outline"
              size="sm"
              className="relative rounded-full gap-2 border-primary/40 hover:border-primary text-foreground hover:bg-primary/5 px-3 py-1.5 h-9 font-semibold"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {itemCount > 0 && (
                <Badge
                  className="w-5 h-5 p-0 flex items-center justify-center rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 border-none shadow-sm animate-pulse"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User Account / Sign In Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-9 h-9 hover:bg-muted relative"
                  aria-label="User Account"
                >
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userAvatar}
                      alt={userName || session?.user?.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-primary/40"
                    />
                  ) : session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={userName || session.user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border border-primary/40"
                    />
                  ) : (
                    <User className={`w-4 h-4 ${session?.user ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`} />
                  )}
                  {session?.user && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-1.5">
                <div className="px-3 py-2 border-b border-border/50">
                  {session?.user ? (
                    <div className="flex items-center gap-2.5">
                      {userAvatar || session.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userAvatar || session.user.image || ''}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border border-primary/40 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {(userName || session.user.name || 'P').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {userName || session.user.name || 'Valued Patron'}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-foreground">Welcome Guest</p>
                      <p className="text-[11px] text-muted-foreground">Sign in to earn rewards & view history</p>
                    </>
                  )}
                </div>

                {session?.user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer text-xs font-medium">
                        My Profile & Addresses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer text-xs font-medium">
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/track-order" className="cursor-pointer text-xs font-medium">
                        Live Order Tracker
                      </Link>
                    </DropdownMenuItem>
                    {((session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'STAFF') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin"
                            className="cursor-pointer text-xs font-semibold text-primary flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Admin & Staff Portal
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('user_session')
                        }
                        setUserAvatar(null)
                        setUserName(null)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="cursor-pointer text-xs font-medium text-destructive flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer text-xs font-medium">
                        Sign In / Register
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/track-order" className="cursor-pointer text-xs font-medium">
                        Live Order Tracker
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="cursor-pointer text-xs font-semibold text-primary flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Admin & Staff Portal
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Order Online CTA Button */}
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex bg-primary hover:bg-purple-700 text-white font-semibold text-xs rounded-full px-5 h-9 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all"
            >
              <Link href="/menu">Order Online</Link>
            </Button>

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg w-9 h-9"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-border/60 bg-background/98 backdrop-blur-xl px-4 py-4 space-y-3"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground/80 hover:bg-muted'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>

              <div className="pt-2 border-t border-border/50 flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-purple-700 text-white font-semibold text-sm rounded-xl py-2.5 shadow-md"
                >
                  <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
                    Order Food Online
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-amber-600/40 text-amber-900 dark:text-gold-400 hover:bg-amber-500/10 font-semibold text-sm rounded-xl py-2.5"
                >
                  <Link href="/events" onClick={() => setMobileMenuOpen(false)}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Event / Venue
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
