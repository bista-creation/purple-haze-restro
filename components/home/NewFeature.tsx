'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  MapPin,
  Utensils,
  Calendar,
  Clock,
  Sparkles,
  PhoneCall,
} from 'lucide-react'

interface ExperienceItem {
  number: string
  title: string
  description: string
  image: string
  alt: string
  className: string
  tag: string
  meta: string
  icon: React.ElementType
}

const experiences: ExperienceItem[] = [
  {
    number: '01',
    title: 'A garden-side evening',
    description:
      'Settle in, slow down, and make room for one more story around the table under the open sky.',
    image: '/images/purple-haze-garden.jpg',
    alt: 'Outdoor garden dining at Purple Haze',
    className: 'md:col-span-7',
    tag: 'Open-Air Ambience',
    meta: 'Golden Hour · 5 PM Onwards',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Something to share',
    description:
      'From smoky chicken momo to artisanal paneer tandoori pizza, find a new favorite for the table.',
    image: '/images/purple-haze-dining.jpg',
    alt: 'A meal shared at Purple Haze',
    className: 'md:col-span-5 md:mt-24',
    tag: 'Signature Plates',
    meta: 'Crafted Fresh Daily',
    icon: Utensils,
  },
  {
    number: '03',
    title: 'Make it a gathering',
    description:
      'Bring your people together for a milestone celebration, an intimate family meal, or a special occasion.',
    image: '/images/purple-haze-gathering.jpg',
    alt: 'A gathering at Purple Haze Restro & Garden',
    className: 'md:col-span-8 md:col-start-3 md:mt-6',
    tag: 'Private & Group Dining',
    meta: 'Custom Event Curations',
    icon: Calendar,
  },
]

function Experience3DCard({ item }: { item: ExperienceItem }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const IconComponent = item.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate rotation between -9 and +9 degrees
    const rotateY = ((mouseX - width / 2) / (width / 2)) * 9
    const rotateX = -((mouseY - height / 2) / (height / 2)) * 9

    setRotation({ x: rotateX, y: rotateY })
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.28,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <article
      className={`${item.className} [perspective:1400px]`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: isHovered
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            : 'transform 650ms cubic-bezier(0.23, 1, 0.32, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="group relative aspect-[4/3.3] sm:aspect-[16/11] w-full cursor-pointer rounded-3xl bg-[#24142e] shadow-[0_22px_50px_-12px_rgba(36,20,46,0.28)] hover:shadow-[0_35px_75px_-15px_rgba(91,40,115,0.45)]"
      >
        {/* Outer Glowing 3D Border Rim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-white/40 via-[#9b7426]/30 to-[#5b2873]/50 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Base Image Container (Clipped) */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl bg-[#190c1f]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Multi-layered rich atmospheric gradients */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#120717]/95 via-[#190c1f]/40 to-black/10 transition-opacity duration-500 group-hover:opacity-90"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(155,116,38,0.22),transparent_60%)]"
          />

          {/* Interactive 3D Specular Glare Overlay */}
          <div
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.55) 0%, rgba(196, 148, 224, 0.15) 35%, transparent 70%)`,
              opacity: glare.opacity,
            }}
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
          />
        </div>

        {/* 3D Floating Layer 1: Top Bar (Number & Category Pill) */}
        <div
          style={{ transform: 'translateZ(45px)' }}
          className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-7"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-[#190c1f]/50 px-3.5 py-1.5 text-xs font-medium tracking-widest text-white shadow-lg backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#e2b857] shadow-[0_0_8px_#e2b857]" />
            <span>{item.number}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/95 shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:border-[#e2b857]/50 group-hover:bg-[#190c1f]/60">
            <IconComponent className="h-3.5 w-3.5 text-[#e2b857]" />
            <span>{item.tag}</span>
          </div>
        </div>

        {/* 3D Floating Layer 2: Decorative Ambient Watermark Number */}
        <span
          aria-hidden="true"
          style={{ transform: 'translateZ(25px)' }}
          className="pointer-events-none absolute right-6 bottom-28 select-none font-[var(--font-heading)] text-7xl sm:text-8xl font-bold italic leading-none text-white/[0.06] transition-all duration-500 group-hover:text-white/[0.12]"
        >
          {item.number}
        </span>

        {/* 3D Floating Layer 3: Bottom Content Box */}
        <div
          style={{ transform: 'translateZ(60px)' }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#e2b857]">
            <Clock className="h-3.5 w-3.5" />
            <span>{item.meta}</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-[var(--font-heading)] text-2xl font-normal tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
                {item.title}
              </h3>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                {item.description}
              </p>
            </div>

            {/* Floating 3D Action Orb */}
            <div
              style={{ transform: 'translateZ(75px)' }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-[#e2b857] group-hover:bg-[#e2b857] group-hover:text-[#190c1f]"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function NewFeature() {
  return (
    <section
      aria-labelledby="experiences-heading"
      className="relative overflow-hidden bg-[#faf7f2] px-5 py-24 text-[#24142e] sm:px-8 sm:py-32"
    >
      {/* Ambient 3D Background Mesh & Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#79518b0a_1px,transparent_1px),linear-gradient(to_bottom,#79518b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#e6d5f2] via-[#f3e7d3] to-transparent opacity-80 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-16 h-96 w-96 rounded-full bg-gradient-to-tr from-[#eadcf5] via-[#f7eedc] to-transparent opacity-70 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Editorial Header Section */}
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#79518b]/20 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#9b7426]" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5b2873]">
                Purple Haze · Biratnagar
              </span>
            </div>

            <h2
              id="experiences-heading"
              className="font-[var(--font-heading)] text-4xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
            >
              Gather around
              <span className="mt-1 block bg-gradient-to-r from-[#5b2873] via-[#79518b] to-[#9b7426] bg-clip-text italic text-transparent">
                something good.
              </span>
            </h2>
          </div>

          <div className="relative rounded-2xl border border-[#e5dce8]/80 bg-white/60 p-6 shadow-[0_10px_30px_-15px_rgba(36,20,46,0.08)] backdrop-blur-md md:max-w-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9b7426]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9b7426]" />
              The Restro & Garden Experience
            </div>
            <p className="text-base leading-relaxed text-[#574b5c]">
              Garden-side dinners, signature flavors, and a little more room for
              the moments worth sharing.
            </p>
          </div>
        </div>

        {/* 3D Interactive Bento Grid */}
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-12">
          {experiences.map((item) => (
            <Experience3DCard key={item.number} item={item} />
          ))}
        </div>

        {/* Floating 3D Glassmorphic Action Dock */}
        <div className="mt-20 rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_20px_50px_-15px_rgba(91,40,115,0.12)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <a
              href="https://share.google/vsLUbVcb9jrm2u5gv"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 text-sm font-medium text-[#4a3f50] transition hover:text-[#5b2873]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5eef9] text-[#9b7426] shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#5b2873] group-hover:text-white">
                <MapPin aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <span className="block text-xs uppercase tracking-widest text-[#8c7f92]">
                  Location & Directions
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1.5 text-base font-semibold text-[#24142e] group-hover:text-[#5b2873]">
                  Find us on Airport Road, Biratnagar
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </a>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border-2 border-[#5b2873]/20 bg-white px-7 py-3.5 text-sm font-semibold text-[#5b2873] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5b2873] hover:bg-[#faf5fc] hover:shadow-md active:translate-y-0"
              >
                <Utensils className="h-4 w-4" />
                Explore the menu
              </Link>

              <a
                href="tel:+9779851150987"
                className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5b2873] to-[#3d194f] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(91,40,115,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-5px_rgba(91,40,115,0.65)] active:translate-y-0"
              >
                <PhoneCall className="h-4 w-4 text-[#e2b857]" />
                Call to plan a visit
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}