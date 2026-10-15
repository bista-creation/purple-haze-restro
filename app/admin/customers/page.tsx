'use client'

import React, { useState } from 'react'
import { Users, Search, ShieldCheck, ShieldAlert, ShoppingBag, Phone, Mail } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { AdminGuard } from '@/components/admin/AdminGuard'

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState([
    {
      id: 'cust-1',
      name: 'Ramesh KC',
      phone: '9852022202',
      email: 'ramesh.kc@example.com',
      ordersCount: 14,
      totalSpent: 18450,
      isBlocked: false,
      role: 'CUSTOMER',
      joined: 'Jan 2026',
    },
    {
      id: 'cust-2',
      name: 'Pooja Agrawal',
      phone: '9802770202',
      email: 'pooja.agrawal@example.com',
      ordersCount: 8,
      totalSpent: 12200,
      isBlocked: false,
      role: 'CUSTOMER',
      joined: 'Feb 2026',
    },
    {
      id: 'cust-3',
      name: 'Sushil Thapa',
      phone: '9841537347',
      email: 'sushil@example.com',
      ordersCount: 6,
      totalSpent: 8900,
      isBlocked: false,
      role: 'CUSTOMER',
      joined: 'Mar 2026',
    },
    {
      id: 'cust-4',
      name: 'Deepak Subedi',
      phone: '9842011111',
      email: 'deepak@example.com',
      ordersCount: 3,
      totalSpent: 4250,
      isBlocked: false,
      role: 'CUSTOMER',
      joined: 'Apr 2026',
    },
  ])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleBlock = (id: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, isBlocked: !c.isBlocked } : c
      )
    )
    toast.info('Customer status updated.')
  }

  return (
    <AdminGuard featureTitle="Customer Directory & Privileges">
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Patron Records
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Customer Directory
          </h1>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2">Contact</th>
              <th className="py-3 px-2">Total Orders</th>
              <th className="py-3 px-2">Lifetime Spent</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3.5 px-2">
                  <span className="font-bold text-foreground block">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">Joined {c.joined}</span>
                </td>
                <td className="py-3.5 px-2 text-muted-foreground">
                  <p>{c.phone}</p>
                  <p className="text-[11px]">{c.email}</p>
                </td>
                <td className="py-3.5 px-2 font-semibold text-foreground">
                  {c.ordersCount} orders
                </td>
                <td className="py-3.5 px-2 font-bold text-primary">
                  {formatPrice(c.totalSpent)}
                </td>
                <td className="py-3.5 px-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.isBlocked
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {c.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBlock(c.id)}
                    className="h-8 text-xs rounded-xl border-border"
                  >
                    {c.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminGuard>
  )
}
