import React from 'react'
import Link from 'next/link'
import {
  FileText,
  Scale,
  ShieldAlert,
  CheckCircle2,
  Utensils,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export const metadata = {
  title: 'Terms & Conditions | Purple Haze Restro & Garden',
  description: 'Review the terms and conditions governing online food ordering, table reservations, banquet bookings, and dine-in services at Purple Haze Restro & Garden in Biratnagar.',
}

export default function TermsAndConditionsPage() {
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
            <Scale className="w-3.5 h-3.5 text-gold-400" />
            <span>Customer Agreement &amp; Operating Policies</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before utilizing our online food delivery, dining facilities, table reservations, or banquet booking services.
          </p>
          <p className="text-[11px] text-purple-300/60 mt-3 font-mono">
            Last Updated: {lastUpdated} · Governed by the Laws of Nepal
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 leading-relaxed text-sm">
          {/* Introduction */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Agreement to Terms
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By accessing our website, placing food delivery orders, or reserving tables and venues at Purple Haze Restro &amp; Garden (Airport Line, Biratnagar), you acknowledge and agree to be bound by these Terms and Conditions and our associated operational policies. If you do not agree to these terms, please refrain from using our digital services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              Online Food Ordering &amp; Pricing
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Pricing:</strong> All prices listed on our menu are in Nepalese Rupees (NPR / Rs.) and inclusive of all applicable service taxes unless explicitly stated otherwise.
              </li>
              <li>
                <strong className="text-foreground">Menu Availability:</strong> All dishes and beverages are subject to daily ingredient availability. In the rare event an item is sold out after an order is placed, our kitchen team will promptly contact you to provide an equivalent replacement or immediate refund.
              </li>
              <li>
                <strong className="text-foreground">Order Acceptance:</strong> An order is deemed confirmed once you receive our on-screen confirmation and SMS / email notification with your unique order number (e.g. PH-XXXXX).
              </li>
              <li>
                <strong className="text-foreground">Payment Modes:</strong> We accept online digital payments via eSewa, Khalti, and Cash on Delivery (COD). For COD orders above Rs. 2,000, our dispatch team may make a quick phone call to verify the delivery address prior to kitchen preparation.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              Table Reservations &amp; Dine-In Etiquette
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Reservation Grace Period:</strong> Reserved tables will be held for up to 20 minutes past the scheduled arrival time. If you anticipate a delay, please call our reception desk in advance to retain your table.
              </li>
              <li>
                <strong className="text-foreground">Garden &amp; Family Atmosphere:</strong> Purple Haze Restro &amp; Garden is a family-friendly venue. We expect all patrons to maintain respectful behavior towards fellow guests and our hospitality staff.
              </li>
              <li>
                <strong className="text-foreground">Alcohol Regulations:</strong> In compliance with prevailing Nepalese statutes, alcoholic beverages are strictly served to persons aged 18 and above. Management reserves the right to request age verification proof.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              Banquet &amp; Venue Booking Contracts
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              For events hosted in our Royal Heritage Banquet Hall, Lush Garden Lawn, or Executive Conference Suite:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Advance Deposit:</strong> A minimum advance deposit of 30% to 50% of the estimated package cost is required to confirm booking of halls or lawn dates.
              </li>
              <li>
                <strong className="text-foreground">Final Guest Count:</strong> The final guaranteed guest count must be submitted to the banquet manager at least 48 hours prior to the event commencement for catering preparation.
              </li>
              <li>
                <strong className="text-foreground">Damage Liability:</strong> The event organizer is responsible for any willful damage caused to hall infrastructure, sound systems, or flora beyond ordinary wear and tear.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                4
              </span>
              Promotions, Coupon Codes &amp; Loyalty Vouchers
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>Promo codes (e.g., `VIPWELCOME10`, `PURPLE10`, `FLAT100`) must be applied at the checkout screen before payment submission. Discounter amounts cannot be applied retroactively to already-settled bills.</li>
              <li>Coupon codes are non-transferable, possess no cash surrender value, and cannot be combined unless explicitly stated.</li>
              <li>Management reserves the right to modify or conclude promotional discount campaigns with prior notice on our digital platforms.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                5
              </span>
              Intellectual Property Rights
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              All digital assets, photographic media, logos, design themes, culinary names, and brand trademarks displayed on this website are the intellectual property of Purple Haze Restro &amp; Garden. Unauthorized reproduction, scraping, or commercial misuse is prohibited under copyright laws.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                6
              </span>
              Limitation of Liability &amp; Force Majeure
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Purple Haze shall not be held liable for failure or delay in fulfilling delivery or event obligations resulting from acts of God, severe monsoon flooding, civic strikes (bandhs), state-wide road closures, or power supply grid interruptions beyond our reasonable control. In such events, our team will proactively work with customers to reschedule or issue refunds.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                7
              </span>
              Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              These Terms and Conditions shall be governed by and construed in accordance with the prevailing laws of Nepal. Any unresolved disputes arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the competent courts in Morang District, Biratnagar, Nepal.
            </p>
          </section>

          {/* Contact Box */}
          <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Questions Regarding These Terms?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our management desk is always available to clarify terms or assist with booking contracts.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-primary font-medium mt-2">
                <a href={`tel:${RESTAURANT_INFO.primaryPhone}`} className="hover:underline flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {RESTAURANT_INFO.primaryPhone}
                </a>
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {RESTAURANT_INFO.email}
                </a>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-700 transition-colors shrink-0"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
