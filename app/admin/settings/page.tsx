'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  CheckCircle2,
  Store,
  Truck,
  CreditCard,
  Percent,
  Clock,
  ShieldCheck,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AdminGuard } from '@/components/admin/AdminGuard'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    name: RESTAURANT_INFO.name,
    tagline: RESTAURANT_INFO.tagline,
    phone: RESTAURANT_INFO.primaryPhone,
    address: RESTAURANT_INFO.address,
    email: RESTAURANT_INFO.email,
    taxRate: 0, // In %
    minOrderDelivery: 300,
    codEnabled: true,
    esewaEnabled: true,
    khaltiEnabled: true,
    zones: [...RESTAURANT_INFO.deliveryZones],
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch saved settings from database
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings(data.settings)
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success('Restaurant settings saved permanently to database!')
        if (data.settings) setSettings(data.settings)
      } else {
        toast.error(data.error || `HTTP ${res.status}: Failed to save settings.`)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Network error saving restaurant settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateZoneFee = (index: number, newFee: number) => {
    const updated = [...settings.zones]
    updated[index].fee = newFee
    setSettings({ ...settings, zones: updated })
  }

  return (
    <AdminGuard featureTitle="Restaurant Settings & Configuration">
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
              System Configuration
            </span>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Restaurant Settings & Fees
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Changes are permanently written to PostgreSQL database with file backup.
            </p>
          </div>

          <Button
            type="submit"
            disabled={saving || loading}
            className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold gap-2 shadow-sm h-11 px-5 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving to Database...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save All Changes
              </>
            )}
          </Button>
        </div>

        {/* 1. General Info */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" /> General Restaurant Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Restaurant Name
              </label>
              <Input
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Tagline
              </label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Primary Contact Phone
              </label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Official Email
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Physical Address (Biratnagar)
            </label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="rounded-xl text-xs h-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Government VAT / Tax Rate (%)
              </label>
              <Input
                type="number"
                min={0}
                max={50}
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="rounded-xl text-xs h-10"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Set to 0 if all prices on menu are already tax-inclusive.
              </span>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Minimum Order for Delivery (NPR)
              </label>
              <Input
                type="number"
                min={0}
                value={settings.minOrderDelivery}
                onChange={(e) =>
                  setSettings({ ...settings, minOrderDelivery: Number(e.target.value) })
                }
                className="rounded-xl text-xs h-10"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Minimum cart value required at checkout.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Biratnagar Delivery Zones & Fees */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" /> Biratnagar Delivery Zones & Pricing
          </h2>

          <div className="divide-y divide-border/60">
            {settings.zones.map((zone, idx) => (
              <div
                key={zone.name}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-foreground block">{zone.name}</span>
                  <span className="text-[11px] text-muted-foreground">
                    Estimated Transit Time: {zone.estTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Fee (NPR):</span>
                  <Input
                    type="number"
                    min={0}
                    value={zone.fee}
                    onChange={(e) => handleUpdateZoneFee(idx, Number(e.target.value))}
                    className="w-24 text-xs h-9 rounded-lg font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Payment Methods Control */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment Gateways & Methods
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Cash on Delivery / QR on Handover</p>
                <p className="text-[11px] text-muted-foreground">
                  Allows customers in Biratnagar to pay cash or scan Fonepay QR upon receiving their food.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">eSewa Mobile Wallet (Sandbox Enabled)</p>
                <p className="text-[11px] text-muted-foreground">
                  Merchant code EPAYTEST loaded with secure HMAC-SHA256 signature verification.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.esewaEnabled}
                onChange={(e) => setSettings({ ...settings, esewaEnabled: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-background/50 cursor-pointer hover:bg-muted/40 transition-colors">
              <div>
                <p className="font-bold text-foreground">Khalti Digital Wallet (Sandbox Enabled)</p>
                <p className="text-[11px] text-muted-foreground">
                  Khalti test public API key loaded for immediate wallet debits and payment callbacks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.khaltiEnabled}
                onChange={(e) => setSettings({ ...settings, khaltiEnabled: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </form>
    </AdminGuard>
  )
}
