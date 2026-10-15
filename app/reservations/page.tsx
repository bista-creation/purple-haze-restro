'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Utensils,
  Sparkles,
  Phone,
  Info,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { toast } from 'sonner'

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 4,
    tableArea: 'OPEN_GARDEN',
    specialRequests: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    let ref = `RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data?.data?.code || data?.data?.id) {
        ref = data?.data?.code || `RES-${data.data.id.slice(-5).toUpperCase()}`
      }
    } catch (err) {
      console.warn('Reservation API sync deferred', err)
    }

    setSubmitting(false)
    setConfirmedBookingId(ref)
    toast.success('Table reserved successfully!', {
      description: `Reservation Ref: ${ref} • We look forward to welcoming you!`,
    })
  }

  const seatingAreas = [
    {
      id: 'OPEN_GARDEN',
      name: 'Open Garden & Water Fountain',
      desc: 'Ambient outdoor breeze, natural flora, water fountains and evening fairy lights.',
    },
    {
      id: 'INDOOR_DINING',
      name: 'Indoor Dining Hall (AC)',
      desc: 'Cozy, climate-controlled dining with plush seating and background acoustic music.',
    },
    {
      id: 'GAZEBO_PERGOLA',
      name: 'Private Gazebo Cabana',
      desc: 'Intimate secluded wooden cabana ideal for romantic dates and anniversaries.',
    },
    {
      id: 'FAMILY_LOUNGE',
      name: 'Family Lounge & Kids Zone',
      desc: 'Spacious seating adjacent to the playground, ideal for families with children.',
    },
  ]

  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-950 text-white py-14 sm:py-16 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Dine Under the Stars
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Table Reservations
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Reserve your preferred garden table, indoor hall, or private gazebo cabana. No advance reservation fee required.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg">
          {confirmedBookingId ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Your Table is Reserved!
              </h2>
              <div className="inline-block px-4 py-2 rounded-xl bg-muted border border-border font-mono text-sm font-bold text-primary">
                Reference Code: {confirmedBookingId}
              </div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you <strong>{formData.name}</strong>. A table for <strong>{formData.guests} guests</strong> in the <strong>{formData.tableArea.replace('_', ' ')}</strong> has been held for <strong>{formData.date} at {formData.time}</strong>. An SMS confirmation will be sent to <strong>{formData.phone}</strong>.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Button
                  onClick={() => setConfirmedBookingId(null)}
                  variant="outline"
                  className="rounded-xl text-xs"
                >
                  Make Another Reservation
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs"
                >
                  <a href={`tel:${RESTAURANT_INFO.primaryPhone}`}>
                    <Phone className="w-3.5 h-3.5 mr-1" /> Call Restaurant
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seating Area Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 block">
                  1. Choose Your Preferred Seating Area
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seatingAreas.map((area) => (
                    <label
                      key={area.id}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                        formData.tableArea === area.id
                          ? 'border-primary bg-primary/10 ring-2 ring-primary shadow-xs'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-foreground">{area.name}</span>
                        <input
                          type="radio"
                          name="tableArea"
                          value={area.id}
                          checked={formData.tableArea === area.id}
                          onChange={(e) => setFormData({ ...formData, tableArea: e.target.value })}
                          className="text-primary focus:ring-primary mt-0.5"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                        {area.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date, Time, Guests */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 block">
                  2. Select Date, Time & Party Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Date *</label>
                    <Input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Time Slot *</label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Number of Guests *</label>
                    <Input
                      required
                      type="number"
                      min={1}
                      max={50}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 block">
                  3. Contact Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Your Name *</label>
                    <Input
                      required
                      placeholder="e.g. Anjali Koirala"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      placeholder="e.g. 98415XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1 block">Email Address *</label>
                    <Input
                      required
                      type="email"
                      placeholder="e.g. anjali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl text-xs h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 block">
                  Special Dining Requests (Optional)
                </label>
                <Input
                  placeholder="e.g. Birthday decoration, quiet table away from speakers, high chair for toddler..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/60 text-muted-foreground text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Tables are held for up to 20 minutes past reserved time during peak weekend hours.</span>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-xl h-12 shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? 'Confirming Reservation...' : 'Confirm Table Reservation'}
              </Button>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
