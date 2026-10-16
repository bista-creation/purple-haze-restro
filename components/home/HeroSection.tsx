
'use client'

import React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Utensils,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  VolumeX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  {
    icon: Clock,
    title: 'Quick Delivery',
    description: '30–45 Mins in Biratnagar',
  },
  {
    icon: Sparkles,
    title: '4 World Cuisines',
    description: 'Nepali, Indian, Asian, Italian',
  },
  {
    icon: Calendar,
    title: 'Event Venues',
    description: 'Up to 350 Guests Capacity',
  },
  {
    icon: MapPin,
    title: 'Prime Location',
    description: 'Airport Line, Biratnagar',
  },
]

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const reveal = (delay: number) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.7,
      delay: shouldReduceMotion ? 0 : delay,
    },
  })

  return (
    <section className="relative isolate flex min-h-[90svh] items-center justify-center overflow-hidden bg-charcoal-950 text-white">
      {/* Cinematic background video */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-charcoal-950">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
          poster="/images/purplehaze-longshot.jpg"
        >
          <source
            src="/videos/purple-haze-hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* Purple, black and gold cinematic grading */}
        <div className="absolute inset-0 bg-charcoal-950/35" />

        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-950/30 to-charcoal-950/55" />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-charcoal-950/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-charcoal-950/70" />
      </div>

      {/* Ambient purple and gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl"
      />

      {/* Hero content */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Brand positioning */}
          <motion.div
            {...reveal(0)}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-purple-950/50 px-4 py-2 text-xs font-semibold text-amber-200 shadow-lg backdrop-blur-xl sm:text-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>
              Biratnagar’s Premier Garden Restro &amp; Banquet
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            {...reveal(0.1)}
            className="mb-6 font-serif text-5xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Flavors Under the
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-100 bg-clip-text pb-2 text-transparent">
              Open Sky
            </span>
          </motion.h1>

          {/* Restaurant introduction */}
          <motion.p
            {...reveal(0.2)}
            className="mx-auto mb-9 max-w-3xl text-base leading-8 text-purple-50/90 sm:text-lg md:text-xl"
          >
            Experience the perfect blend of{' '}
            <strong className="font-semibold text-white">
              authentic Nepali heritage
            </strong>
            , rich Indian gravies, sizzling Asian woks, and
            artisan Italian flavors in Biratnagar’s open garden
            paradise.
          </motion.p>

          {/* Primary actions */}
          <motion.div
            {...reveal(0.3)}
            className="mx-auto flex max-w-lg flex-col justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl border border-purple-300/30 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-700 px-7 text-base font-semibold text-white shadow-xl shadow-purple-950/40 transition duration-300 hover:-translate-y-0.5 hover:from-purple-600 hover:to-fuchsia-600"
            >
              <Link href="/menu" className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-300" />
                Order Online Now
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-xl border border-amber-300/60 bg-charcoal-950/30 px-7 text-base font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-amber-300 hover:text-charcoal-950"
            >
              <Link href="/events" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Event / Venue
              </Link>
            </Button>
          </motion.div>

          {/* Trust and service highlights */}
          <motion.div
            {...reveal(0.4)}
            className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-charcoal-950/40 p-4 text-left shadow-lg backdrop-blur-lg transition duration-300 hover:border-amber-300/40 hover:bg-purple-950/60"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-500/20 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-purple-100/70">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-white">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* Subtle video indicator */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-white/60">
            <VolumeX className="h-4 w-4" />
            <span>Immersive ambience · Sound off</span>
          </div>
        </div>
      </div>
    </section>
  )
}
