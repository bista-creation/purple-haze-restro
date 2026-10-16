import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CreditCard,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export const metadata = {
  title: 'Privacy Policy | Purple Haze Restro & Garden',
  description: 'Learn how Purple Haze Restro & Garden protects your personal information, online ordering data, and payment privacy in Biratnagar, Nepal.',
}

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Official Legal Compliance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Your privacy and trust are paramount to us at Purple Haze Restro &amp; Garden. This policy outlines our data collection, security, and disclosure practices.
          </p>
          <p className="text-[11px] text-purple-300/60 mt-3 font-mono">
            Effective Date: {lastUpdated} · Governed by the Laws of Nepal
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
              Privacy Highlights
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Purple Haze collects only the necessary information required to process your food orders, table reservations, and event bookings. We never sell or rent your personal data to third parties. All online payments via eSewa and Khalti are processed directly through secure encrypted gateway tokens without saving sensitive financial credentials on our servers.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              When you use our website, place online food orders, book venues, or interact with our services, we may collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Personal Identification:</strong> Full name, email address, mobile contact number.
              </li>
              <li>
                <strong className="text-foreground">Delivery Information:</strong> Street address, landmarks, delivery zone (e.g. Biratnagar Core, Bargachhi, Rani, Jogbani), and special delivery instructions.
              </li>
              <li>
                <strong className="text-foreground">Order &amp; Booking Details:</strong> Items purchased, dietary preferences, booking dates, estimated guests, and special culinary requests.
              </li>
              <li>
                <strong className="text-foreground">Technical Device Data:</strong> IP address, browser type, operating system, and session timestamps collected to optimize site performance and prevent fraud.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              How We Use Your Information
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We utilize customer data exclusively for legitimate operational purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>To prepare and fulfill your dine-in, takeaway, or doorstep delivery orders with speed and accuracy.</li>
              <li>To transmit order status confirmations, digital receipts, and delivery rider arrival notifications via SMS or email.</li>
              <li>To manage table reservations and banquet hall contracts for weddings and corporate conferences.</li>
              <li>To disburse promotional vouchers (e.g. VIP welcome discounts) where you have explicitly opted in to our newsletter.</li>
              <li>To resolve customer complaints, inquiries, or grievance tickets in accordance with consumer protection guidelines.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              Payment Gateway Security &amp; Data Protection
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              We prioritize the highest security standards for financial transactions in Nepal:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <CreditCard className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">eSewa &amp; Khalti Integration</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Transactions made via eSewa and Khalti are processed directly on their respective RBI / Nepal Rastra Bank compliant payment gateways. We never store eSewa MPINs, Khalti passwords, or banking credentials.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                <Lock className="w-5 h-5 text-emerald-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">SSL Encrypted Communication</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  All communications between your browser and our servers are encrypted using 256-bit Secure Sockets Layer (SSL/TLS) technology to safeguard your data against interception.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                4
              </span>
              Cookies and Local Storage
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our website uses cookies and browser local storage strictly for essential user experience functions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>Preserving items in your shopping cart across page navigation.</li>
              <li>Remembering your preferred visual theme (Light Mode vs. Dark Mode).</li>
              <li>Maintaining secure authentication sessions for logged-in accounts.</li>
            </ul>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You can disable cookies in your web browser settings at any time; however, some shopping features may require manual re-entry.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                5
              </span>
              Third-Party Disclosures
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Purple Haze does not trade, sell, or rent your personal identifiable information. Data is shared exclusively with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Internal Delivery Riders:</strong> Provided with your delivery address and contact phone number solely for order drop-off.
              </li>
              <li>
                <strong className="text-foreground">Payment Gateways:</strong> Digital token verification with eSewa and Khalti to acknowledge payment completion.
              </li>
              <li>
                <strong className="text-foreground">Government Authorities:</strong> When formally mandated by applicable judicial or statutory enforcement authorities under Nepalese law.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-mono">
                6
              </span>
              Your Rights &amp; Data Control
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Under the Individual Privacy Act of Nepal, you have the right to inspect, update, or request the deletion of your personal data held in our systems. To request data removal or unsubscribe from promotional communications, please contact our privacy desk below.
            </p>
          </section>

          {/* Contact Privacy Desk */}
          <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-foreground">Data Privacy &amp; Grievance Contact</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Purple Haze Restro &amp; Garden, Airport Line, Biratnagar - 4, Morang
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
