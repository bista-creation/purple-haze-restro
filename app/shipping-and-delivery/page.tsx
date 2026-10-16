import React from 'react'
import Link from 'next/link'
import {
  Truck,
  Clock,
  MapPin,
  ShieldCheck,
  PackageCheck,
  AlertTriangle,
  Phone,
  Mail,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Navigation,
  DollarSign,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export const metadata = {
  title: 'Delivery & Shipping Policy | Purple Haze Restro & Garden',
  description: 'Review our food delivery zones, shipping fees, estimated timelines, and packaging standards across Biratnagar, Nepal.',
}

export default function ShippingAndDeliveryPage() {
  const lastUpdated = 'October 16, 2026'

  const deliveryZones = [
    {
      zone: 'Zone 1: Core Biratnagar',
      coverage: 'Airport Line, Kanchanbari, Main Road, Tintoliya, Golpark (within 3 km)',
      time: '25 – 35 mins',
      fee: 'NPR 50',
      freeAbove: 'Free above NPR 999',
    },
    {
      zone: 'Zone 2: Greater Biratnagar',
      coverage: 'Bargachhi, Roadcess, Traffic Chowk, Bus Park, Pushpalal Chowk (3 – 6 km)',
      time: '35 – 45 mins',
      fee: 'NPR 80',
      freeAbove: 'Free above NPR 1,499',
    },
    {
      zone: 'Zone 3: Extended Suburbs',
      coverage: 'Rani Customs, Mills Area, Morang Industrial Corridor, Tankisinwari (6 – 10 km)',
      time: '45 – 60 mins',
      fee: 'NPR 120',
      freeAbove: 'Free above NPR 1,999',
    },
  ]

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
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            <span>Fast, Fresh &amp; Hygienic Delivery</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Delivery &amp; Shipping Policy
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            From our sizzling kitchen directly to your doorstep. Learn about our delivery zones, transit times, thermal packaging, and dispatch procedures in Biratnagar.
          </p>
          <p className="text-[11px] text-purple-300/60 mt-3 font-mono">
            Operating Daily from 10:30 AM to 9:45 PM · Effective Date: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10 leading-relaxed text-sm">
          {/* Quick Summary Box */}
          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Delivery Commitment at a Glance
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every dish prepared at Purple Haze Restro &amp; Garden is packed in tamper-proof, insulated food-grade containers immediately upon order completion. Our dedicated delivery riders ensure your meals arrive piping hot within an average window of 30 to 45 minutes across Biratnagar.
            </p>
          </div>

          {/* Section 1: Zones & Fees Table */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              Delivery Zones &amp; Shipping Rates
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We deliver within a 10 km radius of our restaurant on Airport Line, Biratnagar. Delivery fees are calculated dynamically based on distance:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Coverage Areas</th>
                    <th className="py-3 px-4">Est. Time</th>
                    <th className="py-3 px-4">Fee</th>
                    <th className="py-3 px-4">Free Delivery Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deliveryZones.map((z, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                        {z.zone}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {z.coverage}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-primary font-medium whitespace-nowrap">
                        {z.time}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                        {z.fee}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                        {z.freeAbove}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              * Note: Areas beyond 10 km (e.g., Itahari, Duhabi) can be serviced for catering or banquet bulk packages via pre-scheduled arrangements. Please contact our manager for out-of-town orders.
            </p>
          </section>

          {/* Section 2: Order Timelines & Preparation */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              Order Preparation &amp; Transit Times
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Because we prepare your meals fresh to order rather than serving pre-cooked food, our standard fulfillment cycle entails:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <h4 className="font-semibold text-xs text-foreground">Kitchen Prep</h4>
                <p className="text-[11px] text-muted-foreground">
                  15 – 25 mins. Complex items like sizzlers, hand-stretched pizzas, and tandoori roasts are cooked fresh.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <Truck className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-xs text-foreground">Rider Transit</h4>
                <p className="text-[11px] text-muted-foreground">
                  10 – 20 mins. Dispatched immediately in thermal carrier boxes to avoid heat loss.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h4 className="font-semibold text-xs text-foreground">Total Window</h4>
                <p className="text-[11px] text-muted-foreground">
                  Average delivery: 30 – 45 mins. Peak evening hours (7:00 – 9:00 PM) may extend by 10 – 15 mins.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              In cases of unexpected weather events (heavy monsoon downpours, traffic blocks, or strike days), our dispatch team will reach out via phone call to provide an updated live ETA.
            </p>
          </section>

          {/* Section 3: Thermal Packaging & Food Safety */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              Hygiene &amp; Tamper-Evident Packaging
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Food safety and hygiene are non-negotiable standards at Purple Haze Restro &amp; Garden:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Food-Grade Containers:</strong> 100% BPA-free, leak-resistant, microwave-safe containers designed to prevent oil seep and maintain distinct textures.
              </li>
              <li>
                <strong className="text-foreground">Tamper-Evident Security Seals:</strong> All paper bags are securely sealed at the kitchen dispatch station with a branded tamper seal sticker. If the seal arrives broken or visibly opened, refuse the package and notify us immediately.
              </li>
              <li>
                <strong className="text-foreground">Temperature Preservation:</strong> Hot gravies and pizzas are carried in insulated heat-retention bags, while beverages and chilled desserts are segregated in cool partitions.
              </li>
              <li>
                <strong className="text-foreground">Complimentary Cutlery &amp; Napkins:</strong> Eco-friendly wooden spoons, forks, tissue packets, and breath mints are supplied with every order.
              </li>
            </ul>
          </section>

          {/* Section 4: Live Order Tracking */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                4
              </span>
              Live Order Tracking &amp; Notifications
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Once you checkout on our website, you receive a unique Order Reference Code (e.g. <code>PH-20261016-XXXX</code>). You can monitor your meal status in real-time on our dedicated{' '}
              <Link href="/track-order" className="text-primary font-medium underline hover:text-primary-700">
                Live Order Tracker
              </Link>:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-muted-foreground">
              <li><strong>Order Placed:</strong> Payment verified via eSewa, Khalti, or selected as COD.</li>
              <li><strong>In Kitchen:</strong> Chefs are firing up your orders in the designated kitchen station.</li>
              <li><strong>Out for Delivery:</strong> Handed over to our delivery rider with assigned contact details.</li>
              <li><strong>Delivered:</strong> Successfully handed over to you or your designated recipient.</li>
            </ol>
          </section>

          {/* Section 5: Delivery Handoff & Customer Availability */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                5
              </span>
              Delivery Handoff &amp; Recipient Availability
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              To guarantee smooth delivery, please observe the following guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Accessible Phone Number:</strong> Please provide a working mobile phone number where our delivery rider can reach you upon arrival at your gate or building entrance.
              </li>
              <li>
                <strong className="text-foreground">Rider Wait Time:</strong> Our riders wait up to 10 minutes at the designated address. If the recipient remains unreachable after repeated calls, the order will return to the restaurant, and prepaid orders may not be refunded.
              </li>
              <li>
                <strong className="text-foreground">Contactless Delivery:</strong> If you prefer contactless delivery, check the box during checkout and specify a safe drop-off spot (such as a security guard desk or veranda table).
              </li>
              <li>
                <strong className="text-foreground">Payment Verification on Delivery:</strong> For Cash on Delivery (COD) orders, please keep exact or close change ready. If paying digitally at the door, our rider carries an eSewa and Khalti dynamic QR code.
              </li>
            </ul>
          </section>

          {/* Section 6: Spillage or Transit Damage */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                6
              </span>
              Damage in Transit &amp; Resolution
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              While our riders are trained in safe navigation, unexpected bumps can occur. If an item arrives spilled, leaked, or cold:
            </p>
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs text-muted-foreground">
              <p>
                <strong>Immediate Action Required:</strong> Please inspect the package before the delivery rider leaves. If severe damage has occurred, take a quick photo and call our dispatch hotline at{' '}
                <a href="tel:+9779852022202" className="text-primary font-bold hover:underline">
                  +977 9852022202
                </a>{' '}
                within 15 minutes of receipt.
              </p>
              <p>
                We will immediately offer either an express priority replacement sent free of charge or an instant refund to your eSewa/Khalti wallet. For full details, review our{' '}
                <Link href="/refund-and-cancellation" className="text-primary font-medium underline">
                  Refund &amp; Cancellation Policy
                </Link>.
              </p>
            </div>
          </section>

          {/* Section 7: Banquet & Event Catering Transport */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                7
              </span>
              Bulk Catering &amp; Event Transport
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              For large group catering, corporate lunches, or offsite garden celebrations exceeding 25 people:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>Orders must be confirmed at least 24 hours in advance with a 50% deposit.</li>
              <li>Delivered in commercial stainless steel chafing warmers with dedicated service staff upon request.</li>
              <li>Free transport across Biratnagar metropolitan city for bulk banquet orders over NPR 15,000.</li>
            </ul>
          </section>

          {/* Section 8: Dispatch Helpline */}
          <section className="border-t border-border pt-8 space-y-4">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                8
              </span>
              Delivery Dispatch Helpline
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Have a question regarding an active delivery or need special dietary delivery packaging? Reach our restaurant dispatch desk directly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border bg-card">
                <Phone className="w-4 h-4 text-primary mb-1.5" />
                <h4 className="text-xs font-bold text-foreground">Delivery Hotline</h4>
                <a href="tel:+9779852022202" className="text-xs text-primary font-semibold hover:underline block mt-0.5">
                  +977 9852022202
                </a>
                <span className="text-[11px] text-muted-foreground">Daily 10:30 AM – 10:00 PM</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <Mail className="w-4 h-4 text-amber-500 mb-1.5" />
                <h4 className="text-xs font-bold text-foreground">Email Support</h4>
                <a href={`mailto:${RESTAURANT_INFO.email}`} className="text-xs text-foreground hover:underline block mt-0.5">
                  {RESTAURANT_INFO.email}
                </a>
                <span className="text-[11px] text-muted-foreground">Replies within 4 hours</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <MapPin className="w-4 h-4 text-emerald-500 mb-1.5" />
                <h4 className="text-xs font-bold text-foreground">Kitchen Location</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Airport Line, Biratnagar - 4, Morang, Nepal
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
