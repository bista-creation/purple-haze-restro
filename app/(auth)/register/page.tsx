'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UtensilsCrossed,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please check your details.')
        setLoading(false)
        return
      }

      // Automatically sign in the newly registered user
      const signInRes = await signIn('credentials', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      })

      if (signInRes?.error) {
        toast.success('Account created! Please sign in with your credentials.')
        router.push('/login')
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'user_session',
            JSON.stringify({ email: formData.email, role: 'CUSTOMER' })
          )
        }
        toast.success('Welcome to Purple Haze!', {
          description: 'Your account has been created and you are now signed in.',
        })
        router.push('/profile')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong during registration. Please try again.')
    } finally {
      setLoading(false)
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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 flex items-center justify-center text-gold-400 shadow-md border border-gold-400/30">
              <UtensilsCrossed className="w-6 h-6 text-gold-300" />
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
            Create an Account
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 font-medium leading-relaxed">
            Enjoy 10% off your first order, track meals & save Biratnagar addresses.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                required
                placeholder="e.g. Roshan Shrestha"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 h-10 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                required
                type="email"
                placeholder="roshan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 h-10 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                required
                type="tel"
                placeholder="98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 h-10 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                required
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 h-10 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 block">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 dark:text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                required
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 h-10 text-xs rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-charcoal-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-purple-600 focus:ring-purple-600/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold h-11 shadow-md shadow-purple-900/20 mt-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Google Register Alternative */}
        <div className="mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            type="button"
            disabled={loading || googleLoading}
            onClick={async () => {
              try {
                setGoogleLoading(true)
                await signIn('google', { callbackUrl: '/profile' })
              } catch (err) {
                console.error(err)
                toast.error('Google sign up could not be initiated. Check your configuration.')
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
                Sign Up with Google
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-neutral-600 dark:text-neutral-400 mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-700 dark:text-purple-300 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
