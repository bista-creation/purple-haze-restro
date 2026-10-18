'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Edit3,
  Trash2,
  Lock,
  Camera,
  Check,
  RotateCcw,
  Clock,
  Tag,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { CATEGORIES_DATA } from '@/lib/data/restaurant-data'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DishPictureFacility } from '@/components/admin/DishPictureFacility'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { DishItem } from '@/types'

export default function AdminMenuPage() {
  const { data: session } = useSession()

  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('ADMIN')

  useEffect(() => {
    let activeRole: 'ADMIN' | 'STAFF' = (session?.user?.role as any) || 'ADMIN'
    try {
      const stored = localStorage.getItem('user_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.role) activeRole = parsed.role
      }
    } catch {
      // Ignore
    }
    setRole(activeRole)
  }, [session])

  const isAdmin = role === 'ADMIN'

  const [dishes, setDishes] = useState<DishItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all')

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<DishItem | null>(null)
  const [deleteConfirmDish, setDeleteConfirmDish] = useState<DishItem | null>(null)

  // New Dish Form State
  const [newDish, setNewDish] = useState({
    name: '',
    price: 350,
    categoryId: 'cat-nepali',
    isVeg: false,
    description: '',
    preparationTime: 20,
    spicyLevel: 1,
    isPopular: false,
    isFeatured: false,
    image: '/images/food-presentation.jpg',
    tags: 'Chef Special, Popular',
  })

  // Fetch Dishes from API
  const fetchDishes = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/menu')
      const data = await res.json()
      if (data.success && Array.isArray(data.dishes)) {
        setDishes(data.dishes)
      }
    } catch (err) {
      console.error('Failed to load menu dishes:', err)
      toast.error('Could not refresh menu catalog.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  // Filter dishes
  const filtered = dishes.filter((d) => {
    if (selectedCat !== 'all' && d.categoryId !== selectedCat && d.category?.cuisine !== selectedCat) {
      return false
    }
    if (vegFilter === 'veg' && !d.isVeg) return false
    if (vegFilter === 'non-veg' && d.isVeg) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchName = d.name.toLowerCase().includes(q)
      const matchDesc = d.description?.toLowerCase().includes(q)
      const matchTag = d.tags?.some((t) => t.toLowerCase().includes(q))
      return matchName || matchDesc || matchTag
    }
    return true
  })

  // Toggle Availability (Kitchen Staff & Admin)
  const handleToggleStock = async (dish: DishItem) => {
    const updatedStatus = !dish.isAvailable
    // Optimistic UI update
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, isAvailable: updatedStatus } : d))
    )

    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': role },
        body: JSON.stringify({ id: dish.id, action: 'toggle-stock' }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(
          `${dish.name} is now marked ${updatedStatus ? 'IN STOCK' : 'SOLD OUT (86)'}`
        )
      } else {
        fetchDishes()
        toast.error(data.error || 'Failed to update availability.')
      }
    } catch {
      fetchDishes()
      toast.error('Network error updating stock.')
    }
  }

  // Toggle Featured (Admin Only)
  const handleToggleFeatured = async (dish: DishItem) => {
    if (!isAdmin) {
      toast.error('Only administrators can promote or feature dishes.')
      return
    }

    const updatedFeatured = !dish.isFeatured
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, isFeatured: updatedFeatured } : d))
    )

    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': role },
        body: JSON.stringify({ id: dish.id, action: 'toggle-featured' }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`${dish.name} featured state updated.`)
      } else {
        fetchDishes()
        toast.error(data.error || 'Failed to update featured state.')
      }
    } catch {
      fetchDishes()
    }
  }

  // Open Edit Modal (Admin Only)
  const handleOpenEdit = (dish: DishItem) => {
    if (!isAdmin) {
      toast.error('Administrator privilege required to edit recipes and pricing.')
      return
    }
    setEditingDish({ ...dish })
    setEditModalOpen(true)
  }

  // Submit Edit Dish
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDish) return

    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': role },
        body: JSON.stringify({
          id: editingDish.id,
          name: editingDish.name,
          price: Number(editingDish.price),
          categoryId: editingDish.categoryId,
          isVeg: editingDish.isVeg,
          spicyLevel: Number(editingDish.spicyLevel),
          description: editingDish.description,
          preparationTime: Number(editingDish.preparationTime),
          image: editingDish.image,
          isPopular: editingDish.isPopular,
          tags: Array.isArray(editingDish.tags) ? editingDish.tags : ['Chef Special'],
        }),
      })

      const data = await res.json()
      if (data.success) {
        setDishes((prev) =>
          prev.map((d) => (d.id === editingDish.id ? data.dish : d))
        )
        setEditModalOpen(false)
        setEditingDish(null)
        toast.success(`Recipe "${editingDish.name}" updated successfully!`)
      } else {
        toast.error(data.error || 'Failed to save changes.')
      }
    } catch {
      toast.error('Network error saving dish updates.')
    }
  }

  // Submit Create New Dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) {
      toast.error('Administrator clearance required to add new dishes.')
      return
    }

    try {
      const tagList = newDish.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': role },
        body: JSON.stringify({
          name: newDish.name,
          price: Number(newDish.price),
          categoryId: newDish.categoryId,
          isVeg: newDish.isVeg,
          spicyLevel: Number(newDish.spicyLevel),
          description: newDish.description,
          preparationTime: Number(newDish.preparationTime),
          image: newDish.image,
          isPopular: newDish.isPopular,
          isFeatured: newDish.isFeatured,
          tags: tagList.length > 0 ? tagList : ['New Creation'],
        }),
      })

      const data = await res.json()
      if (data.success) {
        setDishes([data.dish, ...dishes])
        setAddModalOpen(false)
        toast.success(`Dish "${newDish.name}" added to menu catalog!`)
        setNewDish({
          name: '',
          price: 350,
          categoryId: 'cat-nepali',
          isVeg: false,
          description: '',
          preparationTime: 20,
          spicyLevel: 1,
          isPopular: false,
          isFeatured: false,
          image: '/images/food-presentation.jpg',
          tags: 'Chef Special, Popular',
        })
      } else {
        toast.error(data.error || 'Failed to create dish.')
      }
    } catch {
      toast.error('Network error creating new dish.')
    }
  }

  // Delete Dish (Admin Only)
  const handleDeleteDish = async () => {
    if (!deleteConfirmDish) return
    if (!isAdmin) {
      toast.error('Only administrators can delete dishes.')
      return
    }

    try {
      const res = await fetch(`/api/menu?id=${deleteConfirmDish.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-role': role },
      })
      const data = await res.json()
      if (data.success) {
        setDishes((prev) => prev.filter((d) => d.id !== deleteConfirmDish.id))
        setDeleteConfirmDish(null)
        toast.success(`"${deleteConfirmDish.name}" has been removed from the menu.`)
      } else {
        toast.error(data.error || 'Failed to delete dish.')
      }
    } catch {
      toast.error('Network error deleting dish.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Catalog & Recipe Studio
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isAdmin ? '👑 Admin Mode (Full Edit)' : '👨‍🍳 Staff Mode (Live Stock Only)'}
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Menu Dishes & Photography
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage recipes, customize photos, toggle live kitchen availability, and update Biratnagar prices.
          </p>
        </div>

        {isAdmin ? (
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold gap-2 shadow-sm h-11 px-4"
          >
            <Plus className="w-4 h-4" /> Add New Dish
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Recipe editing restricted to Admin</span>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search dish name, spice, ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-xs rounded-xl"
            />
          </div>

          {/* Quick Veg Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                vegFilter === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                vegFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              🌱 Pure Veg
            </button>
            <button
              type="button"
              onClick={() => setVegFilter('non-veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                vegFilter === 'non-veg'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20'
              }`}
            >
              🍗 Non-Veg
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              selectedCat === 'all'
                ? 'bg-charcoal-900 text-white dark:bg-purple-600 shadow-xs'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            All Categories ({dishes.length})
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedCat === cat.id
                  ? 'bg-charcoal-900 text-white dark:bg-purple-600 shadow-xs'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Loading Purple Haze dish catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No dishes matching your current filter criteria.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Dish & Presentation</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Price (NPR)</th>
                <th className="py-3 px-2">Kitchen Stock</th>
                <th className="py-3 px-2">Featured</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((dish) => (
                <tr key={dish.id} className="hover:bg-muted/40 transition-colors">
                  {/* Dish Thumbnail & Info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-muted border border-border shadow-xs group">
                        <Image
                          src={dish.image || '/images/food-presentation.jpg'}
                          alt={dish.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <h4 className="font-bold text-foreground truncate">{dish.name}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {dish.description || 'Authentic garden cuisine item.'}
                        </p>
                        {dish.tags && dish.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                              {dish.tags[0]}
                            </span>
                            {dish.preparationTime && (
                              <span className="text-[9px] text-muted-foreground font-mono">
                                • {dish.preparationTime}m prep
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-2 font-semibold text-foreground">
                    {dish.category?.name || 'General'}
                  </td>

                  {/* Veg / Non-Veg & Spicy */}
                  <td className="py-3.5 px-2">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dish.isVeg
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {dish.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}
                      </span>
                      {dish.spicyLevel > 0 && (
                        <div className="flex items-center text-amber-500 text-[10px] font-bold">
                          {'🌶️'.repeat(dish.spicyLevel)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-2 font-bold text-foreground">
                    {formatPrice(dish.price)}
                  </td>

                  {/* Live Stock Toggle (Available for Kitchen Staff and Admin) */}
                  <td className="py-3.5 px-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStock(dish)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all shadow-xs ${
                        dish.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/25 border border-rose-500/30'
                      }`}
                    >
                      {dish.isAvailable ? '✓ In Stock' : '✗ 86 / Sold Out'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3.5 px-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(dish)}
                      disabled={!isAdmin}
                      className={`p-1.5 rounded-xl transition-colors ${
                        dish.isFeatured
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-muted-foreground hover:text-foreground'
                      } ${!isAdmin ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title={isAdmin ? 'Toggle Featured Star' : 'Admin only'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isAdmin ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(dish)}
                            className="h-8 px-2.5 text-xs rounded-xl border-border gap-1 font-semibold hover:bg-primary hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmDish(dish)}
                            className="h-8 px-2 text-xs rounded-xl text-rose-600 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                          Read-Only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* -------------------- ADD NEW DISH DIALOG -------------------- */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" /> Add New Dish to Menu
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateDish} className="space-y-4 my-2">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Dish Name *
              </label>
              <Input
                required
                placeholder="e.g. Biratnagar Royal Mutton Sekuwa"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Price (NPR) *
                </label>
                <Input
                  required
                  type="number"
                  min={10}
                  value={newDish.price}
                  onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                  className="rounded-xl text-xs h-10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Cuisine Category *
                </label>
                <select
                  value={newDish.categoryId}
                  onChange={(e) => setNewDish({ ...newDish, categoryId: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground font-semibold"
                >
                  {CATEGORIES_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Embedded Picture Facility */}
            <DishPictureFacility
              currentUrl={newDish.image}
              onChange={(url) => setNewDish({ ...newDish, image: url })}
              dishName={newDish.name}
            />

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Dish Description
              </label>
              <textarea
                rows={2}
                placeholder="Ingredients, culinary heritage, taste profile..."
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Preparation Time (Mins)
                </label>
                <Input
                  type="number"
                  min={5}
                  value={newDish.preparationTime}
                  onChange={(e) => setNewDish({ ...newDish, preparationTime: Number(e.target.value) })}
                  className="rounded-xl text-xs h-10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Spiciness Level
                </label>
                <select
                  value={newDish.spicyLevel}
                  onChange={(e) => setNewDish({ ...newDish, spicyLevel: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground font-semibold"
                >
                  <option value={0}>Mild / Non-Spicy</option>
                  <option value={1}>🌶️ Medium</option>
                  <option value={2}>🌶️🌶️ Hot & Spicy</option>
                  <option value={3}>🌶️🌶️🌶️ Fire / Extra Hot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Menu Tags (Comma-separated)
              </label>
              <Input
                placeholder="e.g. Signature, Chef Special, Recommended"
                value={newDish.tags}
                onChange={(e) => setNewDish({ ...newDish, tags: e.target.value })}
                className="rounded-xl text-xs h-10"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
              <div>
                <span className="text-xs font-bold text-foreground block">Pure Vegetarian?</span>
                <span className="text-[10px] text-muted-foreground block">
                  Marks dish with green emblem in digital menu
                </span>
              </div>
              <input
                type="checkbox"
                checked={newDish.isVeg}
                onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-700 text-white text-xs font-bold h-11 rounded-xl shadow-md"
            >
              Add Dish to Purple Haze Catalog
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------- EDIT DISH DIALOG -------------------- */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" /> Edit Dish & Picture
            </DialogTitle>
          </DialogHeader>

          {editingDish && (
            <form onSubmit={handleSaveEdit} className="space-y-4 my-2">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Dish Title *
                </label>
                <Input
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Price (NPR) *
                  </label>
                  <Input
                    required
                    type="number"
                    value={editingDish.price}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, price: Number(e.target.value) })
                    }
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Category *
                  </label>
                  <select
                    value={editingDish.categoryId}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, categoryId: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground font-semibold"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Embedded Picture Facility for Edit Modal */}
              <DishPictureFacility
                currentUrl={editingDish.image || ''}
                onChange={(url) => setEditingDish({ ...editingDish, image: url })}
                dishName={editingDish.name}
              />

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, description: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Prep Time (Mins)
                  </label>
                  <Input
                    type="number"
                    value={editingDish.preparationTime || 20}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        preparationTime: Number(e.target.value),
                      })
                    }
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Spiciness Level
                  </label>
                  <select
                    value={editingDish.spicyLevel}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        spicyLevel: Number(e.target.value),
                      })
                    }
                    className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground font-semibold"
                  >
                    <option value={0}>Mild / Non-Spicy</option>
                    <option value={1}>🌶️ Medium</option>
                    <option value={2}>🌶️🌶️ Hot & Spicy</option>
                    <option value={3}>🌶️🌶️🌶️ Fire / Extra Hot</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border border-border">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Pure Vegetarian Dish?
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Toggle veg / non-veg marker
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingDish.isVeg}
                  onChange={(e) =>
                    setEditingDish({ ...editingDish, isVeg: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-700 text-white text-xs font-bold h-11 rounded-xl shadow-md"
              >
                Save Recipe & Photo Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------- DELETE CONFIRMATION DIALOG -------------------- */}
      <Dialog open={!!deleteConfirmDish} onOpenChange={() => setDeleteConfirmDish(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl bg-background border border-border text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <DialogTitle className="font-serif text-xl font-bold">
            Remove Dish from Menu?
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-2 mb-6">
            Are you sure you want to remove <strong className="text-foreground">{deleteConfirmDish?.name}</strong>? Customers will no longer be able to order this item online or view it in the digital menu.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDish(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteDish}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              Confirm Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
