'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Tag, Copy, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { AVAILABLE_COUPONS } from '@/lib/data/restaurant-data'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function SpecialOffers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Coupon code ${code} copied to clipboard!`)
    setTimeout(() => setCopiedCode(null), 3000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary-950 via-purple-900 to-charcoal-950 text-white relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold mb-3 border border-gold-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Limited Time Privileges
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Exclusive Deals & Promo Codes
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-2">
            Apply these codes at checkout or mention them when ordering for immediate savings.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {AVAILABLE_COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="relative p-6 rounded-2xl bg-white/5 border border-purple-400/20 backdrop-blur-md flex flex-col justify-between hover:border-gold-400/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold tracking-wider uppercase text-purple-300">
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}% Discount` : `Flat Rs. ${coupon.value} Off`}
                  </span>
                  <Tag className="w-4 h-4 text-gold-400" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/60 border border-dashed border-purple-400/40 mb-3">
                  <span className="font-mono text-base font-bold text-gold-400 tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(coupon.code)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
                    aria-label={`Copy code ${coupon.code}`}
                  >
                    {copiedCode === coupon.code ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-purple-200/90 leading-relaxed mb-4">
                  {coupon.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold text-xs rounded-xl h-9 shadow-md"
                >
                  <Link href="/menu" className="flex items-center justify-center gap-1.5">
                    Order with this Deal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
