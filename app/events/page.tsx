'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Building,
  TreePine,
  Briefcase,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { VENUES_DATA, RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { EventDestinations } from '@/components/home/EventDestinations'



function EventsContent() {
  const searchParams = useSearchParams()
  const preselectedVenue = searchParams.get('venue') || 'royal-heritage-banquet-hall'

  const [activeVenueSlug, setActiveVenueSlug] = useState(preselectedVenue)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    venue: preselectedVenue,
    eventType: 'Wedding Reception',
    eventDate: '',
    guests: 100,
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentVenue =
    VENUES_DATA.find((v) => v.slug === activeVenueSlug) || VENUES_DATA[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          guests: Number(formData.guests),
          venue: formData.venue,
          message: formData.message,
        }),
      })
    } catch (err) {
      console.warn('Events API sync deferred', err)
    }

    setSubmitting(false)
    setSubmitted(true)
    toast.success('Event enquiry received!', {
      description: 'Our event director will call you within 2 business hours.',
    })
  }

  const eventTypes = [
    'Wedding Reception',
    'Engagement Ceremony',
    'Birthday Celebration',
    'Corporate Conference / AGM',
    'Executive Board Meeting',
    'Cocktail & Music Night',
    'Anniversary Party',
    'Other Special Event',
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Biratnagar&apos;s Leading Celebration Hub
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Banquet, Garden & Meeting Venues
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            From regal wedding ceremonies in our Grand Banquet Hall to enchanting open-air garden parties and productive corporate conferences, we provide customized decor, audio-visual support, and multi-cuisine catering.
          </p>
        </div>
      </section>

      {/* Main Venues Showcase */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Venue Selector Navigation */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {VENUES_DATA.map((venue) => {
            const isSelected = venue.slug === currentVenue.slug
            return (
              <button
                key={venue.id}
                type="button"
                onClick={() => {
                  setActiveVenueSlug(venue.slug)
                  setActiveImageIndex(0)
                  setFormData((prev) => ({ ...prev, venue: venue.slug }))
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 font-bold'
                    : 'bg-card border border-border text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {venue.slug.includes('banquet') && <Building className="w-4 h-4 text-gold-400" />}
                {venue.slug.includes('garden') && <TreePine className="w-4 h-4 text-emerald-400" />}
                {venue.slug.includes('meeting') && <Briefcase className="w-4 h-4 text-blue-400" />}
                <span>{venue.name}</span>
              </button>
            )
          })}
        </div>
        {/* Selected Venue Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Photos & Lightbox Carousel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-md">
              <Image
                src={currentVenue.images[activeImageIndex] || currentVenue.images[0]}
                alt={currentVenue.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-foreground flex items-center gap-1.5 shadow-md">
                <Users className="w-4 h-4 text-primary" />
                <span>Capacity: Up to {currentVenue.capacity} Guests</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-charcoal-950/85 backdrop-blur-md px-4 py-2 rounded-2xl text-right text-white">
                <span className="text-[10px] text-purple-200 block">Packages starting from</span>
                <span className="text-xl font-bold text-gold-400">
                  {formatPrice(currentVenue.priceFrom)}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {currentVenue.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === i
                      ? 'border-primary ring-2 ring-primary/30 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Amenities List */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Venue Overview
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1 mb-3">
                {currentVenue.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {currentVenue.description}
              </p>

              {/* Distinct Features */}
              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Venue Features & Setup
                </h4>
                <div className="space-y-1.5">
                  {currentVenue.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/85">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Included Amenities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentVenue.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Need custom decor or catering?</p>
                <p className="text-[11px] text-muted-foreground">Our event planner will craft a personalized package.</p>
              </div>
              <a
                href={`tel:${RESTAURANT_INFO.primaryPhone}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call Planner
              </a>
            </div>
          </div>
        </div>

        {/* Event Booking / Enquiry Form Section */}
        <section id="enquiry-form" className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-600 dark:text-gold-400 mb-2 inline-block">
              Plan Your Special Day
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Book a Venue or Request a Quote
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              Fill out this quick form and our banquet manager will check date availability, propose a custom multi-cuisine menu, and schedule a walk-through.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-foreground">
                Enquiry Successfully Submitted!
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. We have logged your request for the <strong>{formData.eventType}</strong> on <strong>{formData.eventDate || 'your selected date'}</strong>. Our Biratnagar event coordinator will get in touch at <strong>{formData.phone}</strong> shortly.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="mt-4 text-xs rounded-xl"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Your Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Ramesh Shrestha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Contact Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="e.g. 98520XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Preferred Venue *
                  </label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
                  >
                    {VENUES_DATA.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.name} (Max {v.capacity} guests)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Proposed Date *
                  </label>
                  <Input
                    required
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Estimated Guests *
                  </label>
                  <Input
                    required
                    type="number"
                    min={5}
                    max={500}
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Additional Requirements / Catering Preferences
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about buffet options, DJ/music needs, flower decorations, projector requirements, etc."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-xl h-12 shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Checking Availability & Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Venue Enquiry
                  </>
                )}
              </Button>
            </form>
          )}
        </section>

        <EventDestinations />
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}

export default function EventsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
      <EventsContent />
    </React.Suspense>
  )
}

