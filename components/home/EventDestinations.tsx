'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  MapPin,
  Utensils,
  Crown,
  Presentation,
  Sparkles,
  PhoneCall,
  Users,
  Wifi,
  Star,
  CheckCircle2,
} from 'lucide-react'

interface SpaceItem {
  id: string
  badge: string
  title: string
  subtitle: string
  description: string
  image: string
  alt: string
  gridSpan: string
  aspectRatio: string
  icon: React.ElementType
  floatingPills: {
    text: string
    position: string
    accent?: boolean
  }[]
  highlights: string[]
}

const venueSpaces: SpaceItem[] = [
  {
    id: 'restro-garden',
    badge: '01 · Culinary & Open-Air',
    title: 'The Restro & Garden',
    subtitle: 'Signature Flavors Under the Stars',
    description:
      'From smoky tandoori platters and artisanal pizzas to handcrafted momos, enjoy open-air garden breezes or cozy indoor dining.',
    image: '/images/purple-haze-garden.jpg',
    alt: 'The Restro and Garden dining area at Purple Haze Biratnagar',
    gridSpan: 'md:col-span-6',
    aspectRatio: 'aspect-[4/3.6]',
    icon: Utensils,
    floatingPills: [
      {
        text: 'Tandoori & Momo',
        position: 'top-16 -left-3 sm:-left-4 -rotate-3',
        accent: false,
      },
      {
        text: '★ Top Rated Dining',
        position: 'top-4 right-4 rotate-2',
        accent: true,
      },
    ],
    highlights: ['Lush Garden Cabanas', 'Live Grill & Bar', 'Family Friendly'],
  },
  {
    id: 'the-banquet',
    badge: '02 · Grand Celebrations',
    title: 'The Royal Banquet',
    subtitle: 'Weddings, Receptions & Milestones',
    description:
      'A pillarless luxury hall adorned with crystal chandeliers, bespoke stage decor, and curated multi-cuisine catering for unforgettable events.',
    image: '/images/purple-haze-gathering.jpg',
    alt: 'Grand Banquet Hall at Purple Haze Biratnagar',
    gridSpan: 'md:col-span-6',
    aspectRatio: 'aspect-[4/3.6]',
    icon: Crown,
    floatingPills: [
      {
        text: 'Up to 500+ Guests',
        position: 'top-5 right-4 rotate-2',
        accent: true,
      },
      {
        text: 'Weddings & Galas',
        position: 'bottom-36 right-4 -rotate-2',
        accent: false,
      },
    ],
    highlights: ['Custom Stage & Lighting', 'Dedicated Banquet Kitchen', 'Ample Parking'],
  },
  {
    id: 'meeting-arena',
    badge: '03 · Executive & Corporate',
    title: 'The Meeting Arena',
    subtitle: 'Conferences, Seminars & Private Boardrooms',
    description:
      'Sound-insulated, climate-controlled corporate suite equipped with HD projection, high-speed fiber Wi-Fi, and seamless table-side refreshment service.',
    image: '/images/purple-haze-dining.jpg',
    alt: 'Corporate Meeting Arena at Purple Haze Biratnagar',
    gridSpan: 'md:col-span-12',
    aspectRatio: 'aspect-[4/3.4] sm:aspect-[16/8.5] lg:aspect-[21/8.5]',
    icon: Presentation,
    floatingPills: [
      {
        text: 'AV & HD Projector Ready',
        position: 'top-5 right-5',
        accent: false,
      },
      {
        text: 'Corporate & VIP',
        position: 'bottom-6 right-6',
        accent: true,
      },
    ],
    highlights: ['High-Speed Fiber Wi-Fi', 'Acoustic Privacy', 'Custom Tea & Lunch Menus'],
  },
]

function Space3DCard({ space }: { space: SpaceItem }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const Icon = space.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rotateY = ((mouseX - rect.width / 2) / (rect.width / 2)) * 8
    const rotateX = -((mouseY - rect.height / 2) / (rect.height / 2)) * 8

    setRotation({ x: rotateX, y: rotateY })
    setGlare({
      x: (mouseX / rect.width) * 100,
      y: (mouseY / rect.height) * 100,
      opacity: 0.3,
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <article
      className={`${space.gridSpan} [perspective:1500px]`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.015, 1.015, 1.015)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            : 'transform 650ms cubic-bezier(0.23, 1, 0.32, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={`group relative w-full ${space.aspectRatio} rounded-[1.75rem] bg-[#1a0d24] p-[1.5px] shadow-[0_25px_60px_-15px_rgba(10,4,15,0.7)] hover:shadow-[0_35px_80px_-12px_rgba(155,116,38,0.3)]`}
      >
        {/* Metallic Gold & Plum 3D Rim Border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-[#e2b857]/70 via-white/15 to-[#79518b]/60 opacity-75 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Inner Clipped Image Canvas */}
        <div className="relative h-full w-full overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[#14081c]">
          <Image
            src={space.image}
            alt={space.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Multi-layer Cinema Vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0d0513] via-[#160a20]/55 to-black/20"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(226,184,87,0.22),transparent_55%)]"
          />

          {/* Interactive 3D Specular Light Glare */}
          <div
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 243, 214, 0.55) 0%, rgba(155, 116, 38, 0.18) 35%, transparent 70%)`,
              opacity: glare.opacity,
            }}
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
          />
        </div>

        {/* 3D Floating Layer 1: Top Category Badge */}
        <div
          style={{ transform: 'translateZ(40px)' }}
          className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-[#14081c]/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3d486] shadow-lg backdrop-blur-md"
        >
          <Icon className="h-3.5 w-3.5 text-[#e2b857]" />
          <span>{space.badge}</span>
        </div>

        {/* 3D Floating Layer 2: Pop-Out Floating Badges */}
        {space.floatingPills.map((pill, idx) => (
          <div
            key={idx}
            style={{ transform: `translateZ(${65 + idx * 15}px)` }}
            className={`pointer-events-none absolute ${pill.position} hidden sm:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-2xl transition-transform duration-500 group-hover:scale-105 ${
              pill.accent
                ? 'border border-[#ffe299]/60 bg-gradient-to-r from-[#e2b857] to-[#b88628] text-[#190c1f] shadow-[0_10px_25px_rgba(226,184,87,0.4)]'
                : 'border border-white/25 bg-white/15 text-white backdrop-blur-xl'
            }`}
          >
            {pill.accent && <Sparkles className="h-3 w-3 fill-[#190c1f]" />}
            <span>{pill.text}</span>
          </div>
        ))}

        {/* 3D Floating Layer 3: Bottom Information & Highlights */}
        <div
          style={{ transform: 'translateZ(55px)' }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 sm:p-7"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#e2b857]">
            {space.subtitle}
          </p>

          <div className="mt-1 flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight text-white drop-shadow-md sm:text-3xl">
                {space.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                {space.description}
              </p>

              {/* Micro-feature pills */}
              <div className="mt-3.5 flex flex-wrap gap-2">
                {space.highlights.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[#e2b857]" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Floating Magnetic Arrow Button */}
            <div
              style={{ transform: 'translateZ(80px)' }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:border-[#e2b857] group-hover:bg-[#e2b857] group-hover:text-[#190c1f]"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function EventDestinations() {
  return (
    <section
      aria-labelledby="purple-haze-showcase"
      className="relative overflow-hidden bg-[#13091c] px-5 py-20 text-white sm:px-8 sm:py-28 lg:py-32"
    >
      {/* Luxury Dual-Tone Ambient Lighting & Gold Dust Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-full w-1/3 bg-gradient-to-l from-[#9b7426]/20 via-[#5b2873]/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-[32rem] w-[32rem] rounded-full bg-[#4a1c64]/35 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[#c99738]/20 blur-[120px]"
      />

      {/* Decorative Floating 3D Spheres */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[42%] top-16 hidden h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d8b4fe,#6b21a8,#1e092b)] shadow-[0_0_25px_rgba(168,85,247,0.6)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-36 left-[38%] hidden h-9 w-9 rounded-full bg-[radial-gradient(circle_at_30%_30%,#e9d5ff,#7e22ce,#1e092b)] shadow-[0_0_35px_rgba(168,85,247,0.5)] lg:block"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Main Split Layout: Left Editorial Story / Right 3D Bento Grid */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT COLUMN: Brand Story & Conversion */}
          <div className="lg:col-span-5 lg:pr-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e2b857]/35 bg-[#e2b857]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#f3d486] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#e2b857]" />
              <span>Biratnagar’s Premier Destination</span>
            </div>

            <div className="mt-6">
              <p className="font-[var(--font-heading)] text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-[#fff3d1] via-[#e2b857] to-[#b58428] bg-clip-text sm:text-4xl">
                Purple Haze
              </p>
              <p className="mt-1 text-lg font-medium tracking-wide text-[#d7c6e0]">
                Restro & Garden · Banquet · Meeting Arena
              </p>
            </div>

            <h2
              id="purple-haze-showcase"
              className="mt-7 font-[var(--font-heading)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl"
            >
              One venue.
              <span className="mt-1 block bg-gradient-to-r from-white via-[#f5e1b5] to-[#e2b857] bg-clip-text italic text-transparent">
                Endless moments.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#bfb2c9] sm:text-lg">
              Whether it’s a relaxed garden-side dinner over smoky tandoori and
              momos, a grand 500-guest wedding reception, or an executive
              boardroom strategy session—every space at Purple Haze is crafted
              around hospitality.
            </p>

            {/* Quick Capacity & Feature Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <div>
                <p className="font-[var(--font-heading)] text-2xl font-bold text-[#e2b857]">
                  3-in-1
                </p>
                <p className="mt-0.5 text-xs text-[#bfb2c9]">
                  Distinct Venues
                </p>
              </div>
              <div className="border-x border-white/10 px-3">
                <p className="font-[var(--font-heading)] text-2xl font-bold text-[#e2b857]">
                  500+
                </p>
                <p className="mt-0.5 text-xs text-[#bfb2c9]">
                  Banquet Capacity
                </p>
              </div>
              <div className="pl-1">
                <p className="font-[var(--font-heading)] text-2xl font-bold text-[#e2b857]">
                  100%
                </p>
                <p className="mt-0.5 text-xs text-[#bfb2c9]">
                  Custom Catering
                </p>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="tel:+97721464193"
                className="group inline-flex items-center gap-3 rounded-full border border-[#ffe299]/60 bg-gradient-to-r from-[#e2b857] via-[#c99633] to-[#a87619] p-1.5 pl-7 text-sm font-bold text-[#190c1f] shadow-[0_15px_35px_-5px_rgba(226,184,87,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-5px_rgba(226,184,87,0.65)]"
              >
                <span>Reserve Your Space</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#190c1f] text-[#e2b857] transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </a>

              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full border border-[#e2b857]/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-[#e2b857] hover:bg-white/10"
              >
                <Utensils className="h-4 w-4 text-[#e2b857]" />
                <span>Explore the Menu</span>
              </Link>
            </div>

            {/* Social Proof Trust Bar */}
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#13091c] bg-gradient-to-br from-[#79518b] to-[#351747] text-xs font-bold text-white">
                  PH
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#13091c] bg-gradient-to-br from-[#e2b857] to-[#9b7426] text-xs font-bold text-[#13091c]">
                  <Users className="h-4 w-4" />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#13091c] bg-gradient-to-br from-[#5b2873] to-[#24142e] text-xs font-bold text-[#e2b857]">
                  <Star className="h-4 w-4 fill-[#e2b857]" />
                </span>
              </div>
              <div className="text-xs sm:text-sm text-[#c8bcd2]">
                Trusted by{' '}
                <strong className="font-semibold text-[#f3d486]">
                  10,000+ Guests
                </strong>{' '}
                for dining, weddings & corporate events in Biratnagar.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Interactive Bento Cards */}
          <div className="lg:col-span-7">
            <div className="grid gap-6 md:grid-cols-12">
              {venueSpaces.map((space) => (
                <Space3DCard key={space.id} space={space} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Glassmorphic Contact & Location Bar (NO Navigation Links) */}
        <div className="mt-16 rounded-3xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:mt-20 sm:px-8 sm:py-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            {/* Location Info */}
            <a
              href="https://share.google/vsLUbVcb9jrm2u5gv"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e2b857]/30 bg-[#e2b857]/15 text-[#e2b857] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#e2b857] group-hover:text-[#13091c]">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#e2b857]">
                  Location Detail
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white sm:text-base">
                  Airport Road, Biratnagar · Purple Haze Restro & Garden
                  <ArrowUpRight className="h-4 w-4 text-[#e2b857] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>

            <div
              aria-hidden="true"
              className="hidden h-10 w-px bg-white/15 md:block"
            />

            {/* Direct Phone & Inquiry Info */}
            <a
              href="tel:+97721464193"
              className="group flex items-center gap-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#e2b857] transition-all duration-300 group-hover:scale-105 group-hover:border-[#e2b857] group-hover:bg-[#e2b857] group-hover:text-[#13091c]">
                <PhoneCall className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#bfb2c9]">
                  Table & Hall Booking
                </span>
                <span className="mt-0.5 block text-sm font-semibold text-white group-hover:text-[#f3d486] sm:text-base">
                  +977 021-464193
                </span>
              </div>
            </a>

            <div
              aria-hidden="true"
              className="hidden h-10 w-px bg-white/15 lg:block"
            />

            {/* Amenity Pill Badge */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-[#d7c6e0]">
              <Wifi className="h-4 w-4 shrink-0 text-[#e2b857]" />
              <span>
                Open Daily · <strong className="text-white">Garden Dining, AC Hall & VIP Parking</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}