'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShoppingBag,
  CreditCard,
  Truck,
  Calendar,
  Utensils,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FAQItem {
  question: string
  answer: string
  category: 'ordering' | 'payments' | 'delivery' | 'dining' | 'banquets'
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [openIndices, setOpenIndices] = useState<number[]>([0]) // first open by default

  const faqs: FAQItem[] = [
    {
      category: 'ordering',
      question: 'How do I place an online food order at Purple Haze?',
      answer:
        'You can browse our digital menu at /menu, select your desired appetizers, mains, pizzas, and beverages, customize spice levels or add-ons, and proceed to checkout. You can check out as a registered guest or log in to track your order history and loyalty points.',
    },
    {
      category: 'payments',
      question: 'Which payment methods are accepted for online and dine-in orders?',
      answer:
        'We accept all major Nepali digital payment gateways including eSewa ePay, Khalti Wallet, Fonepay QR, Mobile Banking, and Visa/Mastercard debit and credit cards. For home delivery, Cash on Delivery (COD) and QR Scan on Delivery are also supported.',
    },
    {
      category: 'payments',
      question: 'Is my online payment safe and secure?',
      answer:
        'Yes, 100%. All online transactions are processed through end-to-end encrypted 256-bit SSL connections directly with authorized payment partners (eSewa and Khalti). Purple Haze Restro & Garden never stores your banking credentials, MPINs, or card CVVs on our servers.',
    },
    {
      category: 'delivery',
      question: 'What are your delivery areas and charges in Biratnagar?',
      answer:
        'We deliver within a 10 km radius of our Airport Line restaurant. Core Biratnagar (within 3 km) is NPR 50 (Free over NPR 999); Greater Biratnagar (3-6 km) is NPR 80; and Extended Suburbs (6-10 km) is NPR 120. Check our Delivery Policy for full geographic breakdowns.',
    },
    {
      category: 'delivery',
      question: 'How long does delivery take from the time I order?',
      answer:
        'Our standard delivery takes 30 to 45 minutes. Because every dish is cooked fresh to order, kitchen prep takes 15-25 minutes followed by 10-15 minutes of transit in insulated thermal bags. During peak weekend hours or heavy rains, delivery may take up to 60 minutes.',
    },
    {
      category: 'payments',
      question: 'What is your refund policy if an order is cancelled or incorrect?',
      answer:
        'You may cancel within 5 minutes of placing an order for a full 100% refund. If an item is missing, damaged, or spilled in transit, our dispatch team can immediately send a fresh replacement or process a refund to your original eSewa/Khalti wallet within 24 to 48 hours.',
    },
    {
      category: 'dining',
      question: 'Do I need to reserve a table in advance for dining in?',
      answer:
        'Walk-in guests are always welcome! However, for Friday evenings, Saturday family lunches, and festival dinners, we highly recommend reserving a table online at /reservations or calling +977 9852022202 to guarantee seating in our scenic garden or fountain view areas.',
    },
    {
      category: 'banquets',
      question: 'Can I book a banquet hall for weddings, birthdays, or corporate seminars?',
      answer:
        'Yes! We feature the Grand Banquet Hall (capacity up to 350 guests), Open Garden & Fountain Terrace (up to 250 guests), and Executive Meeting Hall (up to 45 guests). We offer comprehensive packages including live buffet counters, sound/DJ systems, and custom floral decorations.',
    },
    {
      category: 'dining',
      question: 'Do you offer pure vegetarian, Jain, or Halal-friendly preparations?',
      answer:
        'Yes. We operate separate veg and non-veg preparation stations with dedicated cookware. You can filter all veg items directly on our digital menu. For Jain (no onion/garlic) or specific dietary requirements, simply add a note during checkout or inform your service captain.',
    },
    {
      category: 'banquets',
      question: 'What is the deposit and cancellation policy for event bookings?',
      answer:
        'A 50% advance deposit is required to confirm banquet dates. Cancellations made 14 or more days before the event receive an 80% refund of the deposit. Cancellations between 7 and 13 days receive a 50% refund, or can be rescheduled without penalty.',
    },
    {
      category: 'ordering',
      question: 'Who should I contact if I have a grievance or unresolved complaint?',
      answer:
        'We take customer satisfaction seriously. You can reach our designated Grievance Officer, Mr. Binod Karki (Operations Manager), directly at grievance@purplehaze.com.np or call +977 9852022202. All consumer grievances are formally resolved within 48 business hours.',
    },
  ]

  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'ordering', label: 'Ordering & Menu', icon: ShoppingBag },
    { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
    { id: 'delivery', label: 'Delivery & Shipping', icon: Truck },
    { id: 'dining', label: 'Dine-In & Tables', icon: Utensils },
    { id: 'banquets', label: 'Banquet & Events', icon: Calendar },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleAccordion = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index))
    } else {
      setOpenIndices([...openIndices, index])
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-purple-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/15 text-gold-300 text-xs font-semibold mb-3 border border-gold-400/25">
            <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>Customer Help &amp; Support Hub</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about online ordering, eSewa and Khalti payments, delivery zones, table reservations, and banquet event hosting.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-6 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" />
            <Input
              type="text"
              placeholder="Search by keywords (e.g. eSewa, delivery fee, refund, booking)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 h-12 rounded-2xl bg-purple-900/40 border border-purple-700/60 text-white placeholder:text-purple-300/60 text-xs focus:ring-2 focus:ring-gold-400 focus:border-transparent shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndices.includes(index)
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl overflow-hidden transition-colors shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-sm sm:text-base font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground border-t border-border/50 leading-relaxed bg-muted/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-2xl p-6">
              <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-serif text-base font-semibold text-foreground mb-1">
                No matching questions found
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                We couldn&apos;t find any questions matching &ldquo;{searchTerm}&rdquo;. Try another term or contact our support team directly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-xs rounded-xl"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Grievance Redressal Card */}
        <div className="mt-12 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Statutory Consumer Grievance Cell</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">
                Official Grievance Redressal Desk
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                In compliance with the Consumer Protection Directives of Nepal, Purple Haze Restro &amp; Garden maintains an escalation desk for service complaints, order disputes, and transaction reconciliations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <span className="font-semibold text-foreground block">Grievance Officer:</span>
                  <span className="text-muted-foreground">Mr. Binod Karki (Operations Lead)</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Resolution Guarantee:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Within 24 – 48 Hours SLA</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Direct Phone:</span>
                  <a href="tel:+9779852022202" className="text-primary hover:underline font-medium">
                    +977 9852022202 / 021-464193
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Grievance Email:</span>
                  <a href={`mailto:${RESTAURANT_INFO.email}`} className="text-primary hover:underline font-medium">
                    {RESTAURANT_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2.5">
              <Button asChild className="rounded-xl text-xs font-semibold h-10 bg-primary hover:bg-primary-700">
                <Link href="/contact">
                  Submit Formal Grievance <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl text-xs font-semibold h-10 gap-1.5">
                <a href={RESTAURANT_INFO.socials.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Support
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
