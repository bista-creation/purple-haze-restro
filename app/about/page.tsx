'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Award,
  Heart,
  Users,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const milestones = [
    {
      year: '2019',
      title: 'Humble Beginnings',
      desc: 'Purple Haze opened along Airport Line with an intimate garden dining setup and fusion local favorites.',
    },
    {
      year: '2021',
      title: 'Garden Lawn & Pergola Expansion',
      desc: 'Transformed our outdoor landscape into an open-air garden paradise with illuminated fairy lights and private dining gazebos.',
    },
    {
      year: '2023',
      title: 'Royal Heritage Banquet & Conference Suite',
      desc: 'Inaugurated our 350-capacity pillar-free banquet hall and state-of-the-art corporate meeting rooms.',
    },
    {
      year: '2026',
      title: 'Digital Ordering & Multi-Cuisine Mastery',
      desc: 'Launched direct digital ordering, eSewa and Khalti payment integration with rapid doorstep delivery across Biratnagar.',
    },
  ]

  const culinaryStations = [
    {
      name: 'Chef Deepak Gautam',
      role: 'Executive Chef · Thakali & Newari Heritage',
      specialty: 'Authentic Himalayan Thali & Wood-Fired Newari Delicacies',
      bio: 'Bringing over 15 years of culinary heritage, Chef Deepak crafts our renowned Thakali sets, tender slow-cooked mutton, and Newari feasts using pure spices.',
      image: '/images/my-cuisine-photo.jpg',
      badge: 'Nepali Classics Specialist',
    },
    {
      name: 'Chef Rajesh Tharu',
      role: 'Master of Tandoor & Royal Mughlai',
      specialty: 'Clay-Oven Tandoori Grills, Malai Tikka & Saffron Biryanis',
      bio: 'Trained in traditional clay tandoors, Rajesh slow-simmers our chicken lajawab, rich paneer lababdar, and fragrant dum handi biryanis with hand-churned butter.',
      image: '/images/chicken-malai-tikka.jpg',
      badge: 'Tandoor & Mughlai Master',
    },
    {
      name: 'Chef Sunil Rai',
      role: 'Head of Asian Wok & Continental Grills',
      specialty: 'Sizzling Hunan Chicken, Wok Hakka Noodles & Sizzlers',
      bio: 'Mastering the fiery temperatures of Asian woks and continental grill hearths, Sunil balances sizzling devil chicken with crispy golden wings and gourmet burgers.',
      image: '/images/Hunan-Chicken.jpg',
      badge: 'Asian Wok & Grill Maestro',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="bg-charcoal-950 text-white py-18 sm:py-24 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Biratnagar’s Culinary Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Our Story &amp; Heritage
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Born out of a deep passion for authentic food and the tranquility of open-air dining, Purple Haze Restro &amp; Garden was founded to bring families, friends, and celebrations together under Biratnagar’s open skies.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> The Purple Haze Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15]">
              Where Exceptional Cuisine Meets Nature&apos;s Calm
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Located peacefully along Airport Line, away from the congested traffic of central Biratnagar, Purple Haze was created as a lush green sanctuary. We envisioned a place where guests could savor sizzling tandoori grills, steaming momos, and crispy pizzas under the evening sky, accompanied by the gentle breeze and twilight fairy lights.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Over the years, we expanded into a multi-facility destination with Biratnagar&apos;s finest grand banquet hall and corporate conference facilities, becoming the venue of choice for weddings, birthdays, family dinners, and high-level corporate events.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <UtensilsCrossed className="w-6 h-6 text-gold-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Multi-Cuisine Mastery</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Authentic Nepali, Indian, Chinese &amp; Continental prepared by dedicated culinary specialists.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
                <Heart className="w-6 h-6 text-red-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Nepalese Hospitality</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Atithi Devo Bhava — every guest is welcomed with attentive warmth and genuine care.
                </p>
              </div>
            </div>
          </div>

          {/* Real Photo Mosaic Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-60 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-border/60 group">
              <Image
                src="/images/purple-haze-garden.jpg"
                alt="Purple Haze Outdoor Garden Dining"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[11px] font-semibold text-white drop-shadow">
                  Lush Garden Dining
                </span>
              </div>
            </div>

            <div className="relative h-60 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-border/60 group sm:mt-6">
              <Image
                src="/images/food-presentation.jpg"
                alt="Purple Haze Master Culinary Presentation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[11px] font-semibold text-white drop-shadow">
                  Artisan Plating &amp; Flavor
                </span>
              </div>
            </div>

            <div className="relative h-60 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-border/60 group sm:-mt-6">
              <Image
                src="/images/meeting-hall-buffet-layout.jpg"
                alt="Purple Haze Grand Banquet Buffet Layout"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[11px] font-semibold text-white drop-shadow">
                  Grand Banquet &amp; Buffets
                </span>
              </div>
            </div>

            <div className="relative h-60 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-border/60 group">
              <Image
                src="/images/purple-night.jpg"
                alt="Purple Haze Twilight & Night Ambiance"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent flex items-end p-3.5">
                <span className="text-[11px] font-semibold text-white drop-shadow">
                  Nightlife &amp; Fairy Lights
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Venue Numbers */}
        <section className="mb-24 py-10 px-6 rounded-3xl bg-muted/40 border border-border/80 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-primary block mb-1">
              5+ Years
            </span>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Of Culinary Excellence
            </p>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-500 block mb-1">
              4 Distinct
            </span>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              World Cuisines
            </p>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-primary block mb-1">
              350+ Guests
            </span>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Banquet Capacity
            </p>
          </div>
          <div>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-emerald-500 block mb-1">
              100% Fresh
            </span>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Local Ingredients
            </p>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mt-1">
              Milestones Along the Way
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm relative flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <span className="font-serif text-2xl font-bold text-gold-500 block mb-2">
                    {m.year}
                  </span>
                  <h4 className="font-serif text-base font-bold text-foreground mb-2">
                    {m.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Culinary Masters & Signature Plating */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              The Culinary Craft
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-foreground mt-1">
              Our Culinary Specialty Stations
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Every cuisine station is led by dedicated culinary specialists utilizing authentic regional recipes, authentic tandoors, and hand-ground spices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {culinaryStations.map((station) => (
              <div
                key={station.name}
                className="rounded-3xl bg-card border border-border/80 overflow-hidden shadow-md flex flex-col hover:shadow-xl hover:border-primary/40 transition-all duration-300"
              >
                <div className="relative h-64 w-full bg-muted">
                  <Image
                    src={station.image}
                    alt={station.specialty}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-charcoal-950 font-body shadow-sm">
                      {station.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-foreground">
                      {station.name}
                    </h4>
                    <p className="text-xs font-semibold text-primary mb-2">
                      {station.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {station.bio}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <span className="text-[11px] font-semibold text-gold-600 dark:text-gold-400 block">
                      ★ Signature: {station.specialty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-950 via-purple-900 to-charcoal-950 text-white p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden border border-purple-400/20">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-serif text-2xl sm:text-4xl font-bold mb-3">
            Experience Purple Haze Today
          </h3>
          <p className="text-xs sm:text-sm text-purple-200/90 mb-7 max-w-lg mx-auto leading-relaxed">
            Order for fast doorstep delivery anywhere in Biratnagar or reserve a table to dine under the stars in our lush garden.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold rounded-2xl text-xs h-11 px-7 shadow-lg"
            >
              <Link href="/menu">Order Food Online</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-2xl text-xs h-11 px-7 backdrop-blur-md"
            >
              <Link href="/reservations">Reserve a Table</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
