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
      desc: 'Purple Haze opened along Airport Line with an intimate garden setup and fusion Nepali-Indian snacks.',
    },
    {
      year: '2021',
      title: 'Water Fountains & Open Garden Expansion',
      desc: 'Transformed our outdoor landscape into an open garden paradise with illuminated fountains and private gazebos.',
    },
    {
      year: '2023',
      title: 'Royal Heritage Banquet & Conference Suite',
      desc: 'Inaugurated our 350-capacity pillar-free banquet hall and state-of-the-art corporate meeting rooms.',
    },
    {
      year: '2026',
      title: 'Digital Ordering & Multi-Cuisine Mastery',
      desc: 'Launched our direct online ordering platform with rapid doorstep delivery across Biratnagar.',
    },
  ]

  const chefs = [
    {
      name: 'Chef Deepak Gautam',
      role: 'Executive Chef & Thakali Specialist',
      bio: 'Bringing over 15 years of authentic Thakali and Newari culinary heritage from the Mustang and Kathmandu valleys.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Chef Rajesh Tharu',
      role: 'Master of Tandoor & Mughlai Gravies',
      bio: 'Trained in traditional clay tandoors, Rajesh crafts our slow-simmered butter chicken, dal bukhara, and royal biryanis.',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Chef Sunil Rai',
      role: 'Head of Asian Wok & Italian Hearth',
      bio: 'Sunil balances the fiery heat of Chinese Szechuan woks with the delicate crusts of hand-stretched wood-fired pizzas.',
      image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?q=80&w=400&auto=format&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-24 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Biratnagar’s Culinary Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Our Story & Heritage
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Born out of a deep love for good food and the tranquility of outdoor dining, Purple Haze Restro & Garden was built to bring families, friends, and colleagues together in Biratnagar.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Purple Haze Vision
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-foreground leading-tight">
              Where Exceptional Cuisine Meets Nature&apos;s Calm
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Located on Airport Line, away from the congested city noise, Purple Haze was created as a peaceful haven. We envisioned a place where guests could savor sizzling tandoori grills, steaming momos, and crispy pizzas under the evening sky, accompanied by the soothing sound of water fountains and twilight fairy lights.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Over the years, we expanded with Biratnagar&apos;s finest grand banquet hall and corporate conference facilities, becoming the venue of choice for weddings, birthdays, and high-level corporate events.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <UtensilsCrossed className="w-6 h-6 text-gold-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Multi-Cuisine Mastery</h4>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Authentic Nepali, Indian, Chinese & Italian prepared by dedicated regional chefs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border">
                <Heart className="w-6 h-6 text-red-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Nepalese Hospitality</h4>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Atithi Devo Bhava — every guest is welcomed with warmth and attentive care.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600"
                alt="Garden Dining"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-md mt-6">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600"
                alt="Kitchen Grill"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-md -mt-6">
              <Image
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600"
                alt="Banquet Hall"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600"
                alt="Signature Mocktails"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <section className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Milestones Along the Way
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm relative flex flex-col justify-between"
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

        {/* Culinary Team */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The Culinary Masters
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Meet Our Head Chefs
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Passionate professionals combining decades of regional and international experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {chefs.map((chef) => (
              <div
                key={chef.name}
                className="rounded-2xl bg-card border border-border/80 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative h-64 w-full bg-muted">
                  <Image
                    src={chef.image}
                    alt={chef.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-foreground">
                      {chef.name}
                    </h4>
                    <p className="text-xs font-semibold text-primary mb-2">
                      {chef.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {chef.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-900 to-purple-900 text-white p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Experience Purple Haze Today
          </h3>
          <p className="text-xs sm:text-sm text-purple-200/90 mb-6 max-w-md mx-auto">
            Order for doorstep delivery anywhere in Biratnagar or book your table to dine in our garden.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-bold rounded-xl text-xs h-10 px-6 shadow-md"
            >
              <Link href="/menu">Order Food Online</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 rounded-xl text-xs h-10 px-6"
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
