'use client'

import React, { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitted(true)
        toast.success('Your message has been sent!', {
          description: `Our guest relations team has received your inquiry and will respond to ${formData.email}.`,
        })
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      console.warn('Contact API sync deferred', err)
      toast.error('Network error. Please try again shortly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="bg-charcoal-950 text-white py-14 sm:py-18 relative overflow-hidden border-b border-primary-900/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-charcoal-950 to-purple-950 opacity-90" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Always at Your Service
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Contact & Location
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or need a customized banquet proposal? Reach out to us directly or visit our restaurant on Airport Line, Biratnagar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Get in Touch
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Location
                  </h4>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {RESTAURANT_INFO.address}
                  </p>
                  <p className="text-[11px] text-primary mt-1 font-semibold">
                    Near Biratnagar Domestic Airport Line
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Call Us
                  </h4>
                  <div className="space-y-0.5 text-xs">
                    <p>
                      <a href="tel:+9779852022202" className="font-bold text-primary hover:underline">
                        +977 9852022202 (Manager Mobile)
                      </a>
                    </p>
                    <p>
                      <a href="tel:+97721464193" className="text-foreground hover:underline">
                        +977 21-464193 / 021-465192 (Landlines)
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Email Inquiries
                  </h4>
                  <a href={`mailto:${RESTAURANT_INFO.email}`} className="text-xs font-medium text-foreground hover:underline">
                    {RESTAURANT_INFO.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Operating Schedule
                  </h4>
                  <div className="text-xs text-foreground space-y-0.5">
                    <p>Sunday – Thursday: 10:00 AM – 10:00 PM</p>
                    <p>Friday – Saturday: 10:00 AM – 11:00 PM</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Chat */}
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-11 shadow-sm gap-2"
                >
                  <a
                    href={RESTAURANT_INFO.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden border border-border shadow-sm h-64 bg-muted">
              <iframe
                title="Purple Haze Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.932971556942!2d87.26901237618991!3d26.452140476924844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef74415822e1b1%3A0xb3551ec9eaee3a65!2sBiratnagar%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Whether you have food feedback, banquet queries, or special dietary requirements, drop us a line below.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-foreground">
                    Message Received!
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Thank you, <strong>{formData.name}</strong>. We have received your message regarding &ldquo;{formData.subject}&rdquo;. We will reply to your email or call you shortly.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    variant="outline"
                    className="mt-4 text-xs rounded-xl"
                  >
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        Full Name *
                      </label>
                      <Input
                        required
                        placeholder="e.g. Binod Pokharel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl text-xs h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        Contact Phone *
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="e.g. 98027XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-xl text-xs h-10"
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
                        placeholder="e.g. binod@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl text-xs h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">
                        Subject *
                      </label>
                      <Input
                        required
                        placeholder="e.g. Birthday Party Booking, Catering inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="rounded-xl text-xs h-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your message, feedback or inquiry details here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary-700 text-white font-semibold text-xs rounded-xl h-11 shadow-md flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message to Purple Haze
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
