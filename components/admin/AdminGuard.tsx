'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowRight, Lock, ShoppingBag, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface AdminGuardProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN'
  featureTitle?: string
}

export function AdminGuard({
  children,
  requiredRole = 'ADMIN',
  featureTitle = 'This section',
}: AdminGuardProps) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [role, setRole] = useState<'ADMIN' | 'STAFF' | 'CUSTOMER' | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
    let currentRole = session?.user?.role
    if (!currentRole && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user_session')
        if (stored) {
          const parsed = JSON.parse(stored)
          currentRole = parsed.role
        }
      } catch {
        // Ignore
      }
    }
    setRole(currentRole as any)
  }, [session])

  // Before hydration is complete, render children consistently so server and client HTML match perfectly
  if (!mounted) {
    return <>{children}</>
  }

  // If role is STAFF and feature requires ADMIN, block access with high-contrast luxury alert
  if (role === 'STAFF') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
          Administrator Privilege Required
        </span>

        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
          Restricted Feature
        </h2>

        <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
          You are currently signed in with a <strong className="text-foreground">Kitchen Staff</strong> account. {featureTitle} contains sensitive management configurations restricted to restaurant owners and administrators.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary-700 text-white text-xs font-bold rounded-xl gap-2">
            <Link href="/admin/orders">
              <ShoppingBag className="w-4 h-4" /> Go to Live Orders
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto text-xs font-semibold rounded-xl gap-2">
            <Link href="/admin">
              <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
