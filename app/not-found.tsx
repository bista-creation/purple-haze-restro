import React from 'react'
import Link from 'next/link'
import { UtensilsCrossed, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-charcoal-950 via-primary-950 to-charcoal-900 text-white text-center">
      <div className="w-16 h-16 rounded-3xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6 shadow-xl">
        <UtensilsCrossed className="w-8 h-8" />
      </div>

      <span className="font-mono text-sm uppercase tracking-widest text-gold-400 font-bold mb-2 block">
        404 — Page Not Found
      </span>

      <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
        Looks Like This Dish Isn&apos;t on the Menu
      </h1>

      <p className="text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for might have been moved or doesn&apos;t exist. Return to our Biratnagar home page or explore our multi-cuisine menu.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-semibold h-11 px-6 shadow-md"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 rounded-xl text-xs font-semibold h-11 px-6"
        >
          <Link href="/menu">Browse Delicious Menu</Link>
        </Button>
      </div>
    </div>
  )
}
