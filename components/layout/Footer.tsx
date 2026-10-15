'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowRight,
  UtensilsCrossed,
  CheckCircle2,
} from 'lucide-react'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="bg-charcoal-950 text-purple-100 border-t border-purple-900/40 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/40">
          {/* Col 1: Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg border border-purple-400/40 p-0.5 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/purple-haze-logo.png"
                  alt="Purple Haze Restro & Garden Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Purple Haze
                </span>
                <span className="text-xs tracking-widest uppercase font-semibold text-gold-400 -mt-1">
                  Restro & Garden • Biratnagar
                </span>
              </div>
            </Link>

            <p className="text-sm text-purple-200/80 leading-relaxed max-w-md">
              Biratnagar&apos;s premier multi-cuisine garden restaurant. Blending authentic Nepali flavors, rich Indian curries, sizzling Asian woks, and handcrafted Italian pizzas in an open-air ambiance with tranquil fountains and live music.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={RESTAURANT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/60 hover:bg-primary-600 text-purple-200 hover:text-white flex items-center justify-center transition-colors border border-purple-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={RESTAURANT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/60 hover:bg-pink-600 text-purple-200 hover:text-white flex items-center justify-center transition-colors border border-purple-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={RESTAURANT_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-purple-900/60 hover:bg-emerald-600 text-purple-200 hover:text-white flex items-center justify-center transition-colors border border-purple-800"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-purple-800/40 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-purple-200/80">
              <li>
                <Link href="/menu" className="hover:text-gold-400 transition-colors">
                  Digital Menu & Order
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-gold-400 transition-colors">
                  Banquet & Venues
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-gold-400 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-400 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  Our Story & Chefs
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gold-400 transition-colors">
                  Live Order Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cuisines & Facilities */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-purple-800/40 pb-2">
              Cuisines & Spaces
            </h4>
            <ul className="space-y-2 text-sm text-purple-200/80">
              <li>
                <span className="text-gold-400 font-medium">Nepali:</span> Thakali, Samay Baji, Momos
              </li>
              <li>
                <span className="text-gold-400 font-medium">Indian:</span> Butter Chicken, Dum Biryani
              </li>
              <li>
                <span className="text-gold-400 font-medium">Chinese:</span> Chowmein, Chilli Paneer
              </li>
              <li>
                <span className="text-gold-400 font-medium">Italian:</span> Wood-Fired Pizza & Pasta
              </li>
              <li className="pt-2 text-xs text-purple-300">
                • Grand Banquet Hall (350 cap)<br />
                • Open Garden & Fountains (250 cap)<br />
                • Executive Meeting Hall (45 cap)
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-purple-800/40 pb-2">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-purple-200/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Airport Line, Airport Road, Biratnagar - 4, Morang, Nepal</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <a href="tel:+9779852022202" className="hover:text-gold-300">
                    +977 9852022202
                  </a>
                  <a href="tel:+97721464193" className="hover:text-gold-300">
                    +977 21-464193 / 465192
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p>Sun - Thu: 10:00 AM - 10:00 PM</p>
                  <p>Fri - Sat: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={RESTAURANT_INFO.socials.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium underline"
                >
                  View on Google Maps <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-serif text-lg font-semibold text-white">
              Join the Purple Haze VIP Club
            </h4>
            <p className="text-xs text-purple-200/70">
              Get exclusive promo codes, festive menu previews, and event invitations.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-purple-900/40 border-purple-800 text-white placeholder:text-purple-300/50 rounded-xl focus:border-gold-500 h-10 text-xs"
            />
            <Button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold px-4 h-10 rounded-xl text-xs shrink-0 shadow-md"
            >
              Subscribe
            </Button>
          </form>
          {subscribed && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Thank you for subscribing!
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300/60 gap-4">
          <p>© {new Date().getFullYear()} Purple Haze Restro & Garden, Biratnagar. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/contact" className="hover:text-purple-200 transition-colors">
              Help & Support
            </Link>
            <Link href="/about" className="hover:text-purple-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/admin" className="text-gold-400/80 hover:text-gold-300 transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
