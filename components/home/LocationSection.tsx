'use client'

import React from 'react'
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { Button } from '@/components/ui/button'

export function LocationSection() {
  return (
    <section className="py-20 bg-muted/30 dark:bg-charcoal-900/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2 inline-block">
            Visit Us in Biratnagar
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Hours, Location & Map
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-gold-500 mx-auto mt-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Conveniently situated along Airport Line, Biratnagar. Ample dedicated parking, tranquil garden seating, and warm eastern Nepalese hospitality.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Restaurant Address
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {RESTAURANT_INFO.address}
                  </p>
                  <p className="text-[11px] text-primary font-medium mt-1">
                    Landmark: Airport Line, 2 minutes from Biratnagar Domestic Airport
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Opening Hours
                  </h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex justify-between gap-4">
                      <span>Sunday – Thursday:</span>
                      <strong className="text-foreground">10:00 AM – 10:00 PM</strong>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>Friday – Saturday:</span>
                      <strong className="text-foreground">10:00 AM – 11:00 PM</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Direct Table & Delivery Lines
                  </h4>
                  <div className="text-xs space-y-1">
                    <p>
                      <a
                        href="tel:+9779852022202"
                        className="font-bold text-primary hover:underline text-sm"
                      >
                        +977 9852022202 (Direct Mobile)
                      </a>
                    </p>
                    <p className="text-muted-foreground">
                      Landlines: +977 21-464193 / 021-465192
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 mt-6 border-t border-border/80 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-11 shadow-sm"
              >
                <a
                  href={RESTAURANT_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Chat
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/30 text-primary hover:bg-primary/5 rounded-xl text-xs font-semibold h-11"
              >
                <a
                  href={RESTAURANT_INFO.socials.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4" /> Get Directions
                </a>
              </Button>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-border shadow-md min-h-[380px] bg-muted relative">
            <iframe
              title="Purple Haze Restro Biratnagar Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.932971556942!2d87.26901237618991!3d26.452140476924844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef74415822e1b1%3A0xb3551ec9eaee3a65!2sBiratnagar%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
