'use client'

import React, { useState } from 'react'
import { Tag, Plus, CheckCircle2, Trash2, Sparkles, Percent } from 'lucide-react'
import { AVAILABLE_COUPONS } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { AdminGuard } from '@/components/admin/AdminGuard'

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState(AVAILABLE_COUPONS)
  const [openModal, setOpenModal] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FLAT',
    value: 10,
    minOrderValue: 500,
    maxDiscount: 200,
    description: '',
  })

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoupon.code) return
    const code = newCoupon.code.trim().toUpperCase()
    setCoupons([
      ...coupons,
      {
        code,
        type: newCoupon.type,
        value: Number(newCoupon.value),
        minOrderValue: Number(newCoupon.minOrderValue),
        maxDiscount: Number(newCoupon.maxDiscount),
        description: newCoupon.description || `${newCoupon.value}% discount on order`,
      },
    ])
    setOpenModal(false)
    toast.success(`Coupon code ${code} created!`)
    setNewCoupon({ code: '', type: 'PERCENTAGE', value: 10, minOrderValue: 500, maxDiscount: 200, description: '' })
  }

  const handleDelete = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code))
    toast.info(`Coupon ${code} removed.`)
  }

  return (
    <AdminGuard featureTitle="Coupons & Promotional Campaigns">
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Marketing & Discounts
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Promotions & Coupon Codes
          </h1>
        </div>

        <Button
          onClick={() => setOpenModal(true)}
          className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-gold-500">
                  {c.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  {c.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {c.description}
              </p>
              <div className="mt-4 pt-3 border-t border-border/60 text-xs space-y-1 text-muted-foreground">
                <p>Min Order Value: <strong className="text-foreground">{formatPrice(c.minOrderValue)}</strong></p>
                {c.maxDiscount && (
                  <p>Max Discount Cap: <strong className="text-foreground">{formatPrice(c.maxDiscount)}</strong></p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(c.code)}
                className="text-xs text-destructive hover:bg-destructive/10 h-8"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md p-6 rounded-3xl bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold">New Coupon Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCoupon} className="space-y-4 my-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Coupon Code *</label>
              <Input
                required
                placeholder="e.g. BIRATNAGAR20"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="rounded-xl text-xs h-10 uppercase font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Discount Type</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                  className="w-full bg-background border border-border rounded-xl h-10 px-2 text-xs"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Amount (NPR)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Value *</label>
                <Input
                  required
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  className="rounded-xl text-xs h-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Min Order (NPR)</label>
                <Input
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                  className="rounded-xl text-xs h-10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Max Discount Cap</label>
                <Input
                  type="number"
                  value={newCoupon.maxDiscount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                  className="rounded-xl text-xs h-10"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Description</label>
              <Input
                placeholder="e.g. 15% discount on family dine-in orders"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary-700 text-white text-xs h-10 rounded-xl">
              Save Coupon
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </AdminGuard>
  )
}
