import React from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Phone,
  Mail,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export const metadata = {
  title: 'Refund & Cancellation Policy | Purple Haze Restro & Garden',
  description: 'Understand the refund, return, and cancellation policies for online food orders, eSewa/Khalti payments, and event bookings at Purple Haze Restro & Garden in Biratnagar.',
}

export default function RefundAndCancellationPage() {
  const lastUpdated = 'October 16, 2026'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-purple-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-purple-200/80 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 text-gold-300 text-xs font-semibold mb-3 border border-gold-400/25">
            <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
            <span>Fair &amp; Transparent Consumer Protection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            We strive for perfection in every dish prepared and delivered. When things don&apos;t go as planned, here is how our hassle-free cancellation and refund process works.
          </p>
          <p className="text-[11px] text-purple-300/60 mt-3 font-mono">
            Compliance Verified for eSewa &amp; Khalti Gateways · Updated {lastUpdated}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 leading-relaxed text-sm">
          {/* Quick Notice */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              100% Guest Satisfaction Guarantee
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If an item is missing from your package, incorrect food is delivered, or your order suffers transit damage, please notify us within 30 minutes of delivery. We will immediately dispatch a fresh replacement or issue an unconditional refund to your eSewa, Khalti, or bank account.
            </p>
          </div>

          {/* Section 1: Food Order Cancellations */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              Online Food Delivery Cancellations
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Within 5 Minutes of Order Placement:</strong> You may cancel your food order without penalty by immediately calling our hotline at{' '}
                <a href={`tel:${RESTAURANT_INFO.primaryPhone}`} className="text-primary font-bold hover:underline">
                  {RESTAURANT_INFO.primaryPhone}
                </a>. If prepaid via eSewa or Khalti, a 100% full refund will be initiated immediately.
              </li>
              <li>
                <strong className="text-foreground">After Kitchen Preparation Has Commenced (&gt;5 Mins):</strong> Because our culinary team cooks all dishes fresh on order, cancellations cannot be accepted once food preparation is underway or when our delivery rider is dispatched.
              </li>
              <li>
                <strong className="text-foreground">Cancellation by Purple Haze:</strong> If an unforeseen kitchen issue, power outage, or extreme monsoon flooding prevents us from preparing or delivering your meal, we will notify you immediately and process an automatic 100% refund.
              </li>
            </ul>
          </section>

          {/* Section 2: When Are Refunds Granted? */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              Eligibility for Immediate Refunds
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You are entitled to a full or partial refund under the following verified circumstances:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Missing or Incorrect Items</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  If an ordered dish is omitted from the delivery package or the wrong dish is supplied, we will refund that item in full or rush a hot replacement without extra delivery fee.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Spillage or Transit Damage</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  If food packaging bursts, leaks severely, or is rendered unhygienic during motorcycle transit, please take a quick photo and send it to our WhatsApp for immediate redress.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <Clock className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">Excessive Delivery Delay</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  If your order is delayed more than 45 minutes beyond the promised delivery window due to our operational fault (excluding extreme weather/roadblocks), you may reject the order for a full refund.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <CreditCard className="w-5 h-5 text-purple-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Duplicate Payment Deduction</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  If your eSewa or Khalti digital wallet was debited twice due to an internet glitch during checkout, the excess charge will be refunded upon gateway transaction verification.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Refund Timelines & Methods */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              Refund Method &amp; Reversal Timelines
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Once an approved refund is authorized by our management, payments are reversed through the original payment channel:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">eSewa Payments:</strong> Reversed back to your eSewa digital wallet balance within <strong className="text-foreground">24 to 48 business hours</strong>.
              </li>
              <li>
                <strong className="text-foreground">Khalti Payments:</strong> Reversed to your Khalti wallet balance within <strong className="text-foreground">24 to 48 business hours</strong>.
              </li>
              <li>
                <strong className="text-foreground">Cash on Delivery (COD):</strong> For cash orders requiring refund after delivery, our guest support will transfer the funds via Fonepay / ConnectIPS direct to your bank account or provide an equivalent Purple Haze store credit voucher.
              </li>
            </ul>
          </section>

          {/* Section 4: Table & Banquet Hall Cancellations */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                4
              </span>
              Table Reservations &amp; Banquet Venue Bookings
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Dine-In Table Reservations:</strong> Table reservations are free to cancel or reschedule at any time before the scheduled time. No cancellation charges apply.
              </p>
              <p>
                <strong className="text-foreground">Banquet Hall &amp; Garden Event Dates:</strong> Because reserving a banquet hall blocks other prospective weddings and corporate conferences, advance booking deposit refunds operate on the following schedule:
              </p>
              <div className="border border-border/80 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted font-bold text-foreground">
                    <tr>
                      <th className="p-3">Notice Given Before Event</th>
                      <th className="p-3">Refund of Advance Deposit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="p-3 font-medium">30 days or more in advance</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">80% Refund (20% administrative handling)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">15 to 29 days in advance</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400 font-bold">50% Refund</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Less than 15 days in advance</td>
                      <td className="p-3 text-destructive font-bold">Non-refundable deposit (date rescheduling subject to availability)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Contact Support Hotline */}
          <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Need Immediate Refund Assistance?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Have your Order Number (e.g. PH-XXXXX) ready and call or message our guest relations desk.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-primary font-medium mt-2">
                <a href={`tel:${RESTAURANT_INFO.primaryPhone}`} className="hover:underline flex items-center gap-1 font-bold">
                  <Phone className="w-3.5 h-3.5" /> Call: {RESTAURANT_INFO.primaryPhone}
                </a>
                <a href={RESTAURANT_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span>WhatsApp Chat</span>
                </a>
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-700 transition-colors shrink-0 shadow-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
