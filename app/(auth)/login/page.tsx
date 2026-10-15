'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  UtensilsCrossed,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const isAccessDenied =
    errorParam === 'AccessDenied' ||
    errorParam === 'unauthorized' ||
    callbackUrl.includes('/admin')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cleanEmail = email.trim().toLowerCase()
      const res = await signIn('credentials', {
        email: cleanEmail,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('Invalid credentials. Please verify your email and password.')
        setLoading(false)
        return
      }

      const role = cleanEmail.includes('admin')
        ? 'ADMIN'
        : cleanEmail.includes('staff')
        ? 'STAFF'
        : 'CUSTOMER'

      if (typeof window !== 'undefined') {
        localStorage.setItem('user_session', JSON.stringify({ email: cleanEmail, role }))
      }

      if (callbackUrl && (role === 'ADMIN' || role === 'STAFF')) {
        toast.success(`Welcome to Purple Haze Portal!`)
        router.push(callbackUrl)
      } else if (cleanEmail === 'admin@purplehaze.com' || cleanEmail.includes('admin')) {
        toast.success('Welcome back, Admin!')
        router.push('/admin')
      } else if (cleanEmail === 'staff@purplehaze.com' || cleanEmail.includes('staff')) {
        toast.success('Welcome back, Staff!')
        router.push('/admin/orders')
      } else {
        toast.success('Welcome back!')
        router.push('/profile')
      }
      router.refresh()
    } catch (err) {
      toast.error('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFillDemo = (type: 'admin' | 'staff' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@purplehaze.com')
      setPassword('Admin@123456')
    } else if (type === 'staff') {
      setEmail('staff@purplehaze.com')
      setPassword('Staff@123456')
    } else {
      setEmail('customer@purplehaze.com')
      setPassword('Customer@123456')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-purple-100/60 via-background to-purple-50 dark:from-charcoal-950 dark:via-purple-950/70 dark:to-charcoal-900 transition-colors">
      {/* Return to Home Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-purple-700 dark:text-neutral-300 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Restaurant
        </Link>
        <span className="text-[11px] font-bold text-amber-700 dark:text-gold-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          Biratnagar, Nepal
        </span>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-charcoal-900 border border-purple-200/90 dark:border-purple-800/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-950/5 dark:shadow-2xl text-neutral-900 dark:text-white transition-colors">
        {/* Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md border border-purple-300 dark:border-purple-700 p-0.5 shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/purple-haze-logo.png"
                alt="Purple Haze Restro & Garden Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="text-left">
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-white block">
                Purple Haze
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-700 dark:text-gold-400 -mt-0.5 block">
                Restro & Garden
              </span>
            </div>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 font-medium leading-relaxed">
            Access your saved delivery addresses, live orders, and loyalty rewards.
          </p>
        </div>

        {/* Security Alert if redirected from admin */}
        {isAccessDenied && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                Restricted Admin Access
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                The restaurant management console requires <strong>Admin</strong> or <strong>Staff</strong> credentials. Please log in with an authorized account below.
              </p>
            </div>
          </div>
        )}

        {/* Demo Accounts Quick-Fill Helper */}
        <div className="mb-6 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-xs">
          <p className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Quick Demo Login (Click to Autofill):
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] shadow-xs transition-colors"
            >
              👑 Admin Portal
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff')}
              className="px-2.5 py-1 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] shadow-xs transition-colors"
            >
              👨‍🍳 Kitchen Staff
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs transition-colors"
            >
              🍽️ Diner / Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white hover:underline font-bold"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold h-11 shadow-md shadow-purple-900/20 mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Purple Haze'}
          </Button>
        </form>

        {/* Google Login Alternative */}
        <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            type="button"
            disabled={loading || googleLoading}
            onClick={async () => {
              try {
                setGoogleLoading(true)
                await signIn('google', { callbackUrl: callbackUrl || '/profile' })
              } catch (err) {
                console.error(err)
                toast.error('Google sign in could not be initiated. Check your configuration.')
              } finally {
                setGoogleLoading(false)
              }
            }}
            className="w-full h-11 rounded-xl text-xs font-bold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 hover:bg-neutral-50 dark:hover:bg-charcoal-700 text-neutral-800 dark:text-neutral-100 gap-2.5 shadow-xs transition-all"
          >
            {googleLoading ? (
              <span>Connecting to Google...</span>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign In with Google
              </>
            )}
          </Button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-neutral-600 dark:text-neutral-400 mt-6 font-medium">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-purple-700 dark:text-purple-300 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-muted-foreground">
          Loading sign in portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
