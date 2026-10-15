'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { UtensilsCrossed, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-charcoal-950 via-primary-950 to-charcoal-900 text-white">
      <div className="w-full max-w-md bg-card/95 border border-border/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-foreground">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-800 flex items-center justify-center text-gold-400 shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-gold-300" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              Purple Haze
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your email and we&apos;ll send a password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-serif text-base font-bold text-foreground">
              Password Reset Link Sent
            </h3>
            <p className="text-xs text-muted-foreground">
              If an account exists for <strong>{email}</strong>, you will receive an email shortly with instructions to reset your password.
            </p>
            <Button asChild variant="outline" className="mt-4 text-xs rounded-xl w-full">
              <Link href="/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 text-xs rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold h-11 shadow-md"
            >
              Send Reset Instructions
            </Button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
