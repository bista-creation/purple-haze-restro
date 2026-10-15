'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Building,
  TreePine,
  Briefcase,
} from 'lucide-react'
import { VENUES_DATA } from '@/lib/data/restaurant-data'
import { formatPrice, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminEventsPage() {
  const [bookings, setBookings] = useState([
    {
      id: 'EVT-101',
      name: 'Pooja Agrawal',
      phone: '9852022202',
      email: 'pooja.agrawal@example.com',
      venue: 'Royal Heritage Banquet Hall',
      eventType: 'Wedding Reception',
      date: '2026-11-20',
      guests: 250,
      status: 'PENDING',
      message: 'Need 2 buffet stations with both Nepali & Italian live counters, flower entrance.',
    },
    {
      id: 'EVT-102',
      name: 'Bikash Karki',
      phone: '9841537347',
      email: 'bikash@example.com',
      venue: 'Lush Open Garden & Water Fountain Area',
      eventType: 'Birthday Party',
      date: '2026-10-28',
      guests: 60,
      status: 'CONFIRMED',
      message: 'Evening fairy lights, acoustic guitar setup, mocktail bar.',
    },
    {
      id: 'EVT-103',
      name: 'Koshi Enterprises',
      phone: '9802770202',
      email: 'hr@koshient.com',
      venue: 'Executive Corporate Meeting & Conference Suite',
      eventType: 'Corporate AGM & Board Meeting',
      date: '2026-11-05',
      guests: 35,
      status: 'CONFIRMED',
      message: 'Full day seminar, projector, lunch package for 35 executives.',
    },
  ])

  const updateStatus = (id: string, newStatus: 'CONFIRMED' | 'REJECTED') => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    toast.success(`Booking ${id} ${newStatus.toLowerCase()}!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
          Venues & Bookings
        </span>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Event Enquiries & Reservations
        </h1>
      </div>

      {/* Venues Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VENUES_DATA.map((venue) => (
          <div
            key={venue.id}
            className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                {venue.slug.includes('banquet') && <Building className="w-4 h-4 text-gold-500" />}
                {venue.slug.includes('garden') && <TreePine className="w-4 h-4 text-emerald-500" />}
                {venue.slug.includes('meeting') && <Briefcase className="w-4 h-4 text-blue-500" />}
                {venue.name}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
              <span>Max Capacity:</span>
              <strong className="text-foreground">{venue.capacity} Guests</strong>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Base Package:</span>
              <strong className="text-primary font-bold">{formatPrice(venue.priceFrom)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Queue */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">
          Customer Booking Requests
        </h3>

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-border/80 bg-background/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                  <span className="text-xs font-bold text-foreground">• {b.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : b.status === 'REJECTED'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-gold-500/10 text-gold-600'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <span>🏛️ {b.venue}</span>
                  <span>🎉 {b.eventType}</span>
                  <span>📅 {formatDate(b.date)}</span>
                  <span>👥 {b.guests} Guests</span>
                </div>

                {b.message && (
                  <p className="text-[11px] text-muted-foreground italic bg-muted/60 p-2 rounded-lg mt-1">
                    &ldquo;{b.message}&rdquo;
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {b.status === 'PENDING' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateStatus(b.id, 'CONFIRMED')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-9"
                    >
                      Approve & Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(b.id, 'REJECTED')}
                      className="rounded-xl text-xs h-9 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      Decline
                    </Button>
                  </>
                )}
                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs h-9 border-border">
                  <a href={`tel:${b.phone}`}>
                    <Phone className="w-3.5 h-3.5 mr-1" /> Call Client
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
