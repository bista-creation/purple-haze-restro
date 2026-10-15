'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  Loader2,
  Save,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Check,
  X,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MiniCart } from '@/components/cart/MiniCart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AVATAR_PRESETS } from '@/lib/data/avatar-presets'
import { toast } from 'sonner'
import { useSession, signOut } from 'next-auth/react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [changingPass, setChangingPass] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [avatarTab, setAvatarTab] = useState<'presets' | 'upload' | 'url'>('presets')
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('')
  const [customInputUrl, setCustomInputUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<{
    name: string
    email: string
    phone: string
    role: string
    image?: string
  }>({
    name: 'Valued Patron',
    email: 'guest@purplehaze.com',
    phone: '',
    role: 'CUSTOMER',
    image: '',
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  })

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Airport Line, Road #2',
      area: 'Airport Road',
      city: 'Biratnagar',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: 'Corporate Tower, Main Road',
      area: 'Roadcess Chowk',
      city: 'Biratnagar',
      isDefault: false,
    },
  ])

  const [newAddressOpen, setNewAddressOpen] = useState(false)
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: 'Biratnagar',
    isDefault: false,
  })

  // Load user profile from database API
  useEffect(() => {
    setMounted(true)

    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')
        const data = await res.json()
        if (data.success && data.user) {
          // If custom image exists in user profile, use it; otherwise fallback to Google OAuth session image
          const activeImage = data.user.image || session?.user?.image || ''
          setProfile({
            name: data.user.name || session?.user?.name || 'Valued Patron',
            email: data.user.email || session?.user?.email || '',
            phone: data.user.phone || '',
            role: data.user.role || (session?.user as any)?.role || 'CUSTOMER',
            image: activeImage,
          })
          if (Array.isArray(data.user.addresses) && data.user.addresses.length > 0) {
            setAddresses(data.user.addresses)
          }
        } else if (session?.user) {
          setProfile((prev) => ({
            ...prev,
            name: session.user?.name || prev.name,
            email: session.user?.email || prev.email,
            role: (session.user as any).role || prev.role,
            image: session.user?.image || '',
          }))
        } else {
          // Check local storage fallback ONLY if no active session
          try {
            const stored = localStorage.getItem('user_session')
            if (stored) {
              const parsed = JSON.parse(stored)
              setProfile((prev) => ({
                ...prev,
                email: parsed.email || prev.email,
                role: parsed.role || prev.role,
                image: parsed.image || '',
                name:
                  parsed.name ||
                  (parsed.role === 'ADMIN'
                    ? 'Purple Haze Admin'
                    : parsed.role === 'STAFF'
                    ? 'Kitchen Staff'
                    : 'Valued Guest'),
              }))
            }
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session])

  // Save Personal Info
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-info',
          name: profile.name,
          phone: profile.phone,
          image: profile.image,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Profile details saved successfully!')
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('user_session')
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed.email?.toLowerCase() === profile.email.toLowerCase()) {
                parsed.name = profile.name
                if (profile.image) parsed.image = profile.image
                localStorage.setItem('user_session', JSON.stringify(parsed))
              }
            }
          } catch {}
          window.dispatchEvent(
            new CustomEvent('profile_updated', {
              detail: { name: profile.name, image: profile.image, email: profile.email },
            })
          )
        }
      } else {
        toast.error(data.error || 'Failed to update profile.')
      }
    } catch {
      toast.error('Network error saving profile changes.')
    } finally {
      setUpdating(false)
    }
  }

  // Handle Photo Save (from Presets, Upload, or Custom URL)
  const handleSaveAvatar = async (urlToSave: string) => {
    setSavingAvatar(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-avatar',
          image: urlToSave,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setProfile((prev) => ({ ...prev, image: urlToSave }))
        if (typeof window !== 'undefined') {
          try {
            const stored = localStorage.getItem('user_session')
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed.email?.toLowerCase() === profile.email.toLowerCase()) {
                parsed.image = urlToSave
                localStorage.setItem('user_session', JSON.stringify(parsed))
              }
            } else {
              localStorage.setItem(
                'user_session',
                JSON.stringify({
                  email: profile.email,
                  name: profile.name,
                  role: profile.role,
                  image: urlToSave,
                })
              )
            }
          } catch {}
          window.dispatchEvent(
            new CustomEvent('profile_updated', {
              detail: { image: urlToSave, name: profile.name, email: profile.email },
            })
          )
        }
        toast.success(urlToSave ? 'Profile photo updated!' : 'Profile photo reset to default.')
        setAvatarModalOpen(false)
      } else {
        toast.error(data.error || 'Failed to update photo.')
      }
    } catch {
      toast.error('Network error saving avatar.')
    } finally {
      setSavingAvatar(false)
    }
  }

  // Handle local file selection and convert to Base64 Data URL
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).')
      return
    }

    // Limit to 2MB to ensure fast storage & database syncing
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be smaller than 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedAvatarUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Please enter both current and new password.')
      return
    }

    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    setChangingPass(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Your password has been changed successfully!')
        setPasswords({ currentPassword: '', newPassword: '' })
      } else {
        toast.error(data.error || 'Password update failed.')
      }
    } catch {
      toast.error('Network error changing password.')
    } finally {
      setChangingPass(false)
    }
  }

  // Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.street || !newAddr.area) return

    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    }

    const updatedAddresses = [...addresses, created]
    setAddresses(updatedAddresses)
    setNewAddr({ label: 'Home', street: '', area: '', city: 'Biratnagar', isDefault: false })
    setNewAddressOpen(false)

    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-addresses',
          addresses: updatedAddresses,
        }),
      })
      toast.success('New delivery address saved to your account!')
    } catch {
      toast.error('Address saved locally; network sync failed.')
    }
  }

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id)
    setAddresses(updated)

    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-addresses',
          addresses: updated,
        }),
      })
      toast.info('Address removed from address book.')
    } catch {
      // Local state updated
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Profile Meta Header */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-purple-800 text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md border-2 border-primary/20 shrink-0">
                {profile.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0) || 'P'
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatarUrl(profile.image || '')
                  setCustomInputUrl(profile.image || '')
                  setAvatarModalOpen(true)
                }}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 sm:p-2 rounded-xl bg-primary hover:bg-primary-700 text-white shadow-lg transition-transform hover:scale-105 border-2 border-card flex items-center justify-center"
                title="Change profile picture"
                aria-label="Change profile picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold text-[10px] border border-gold-500/30">
                  {profile.role === 'ADMIN'
                    ? '👑 Executive Admin'
                    : profile.role === 'STAFF'
                    ? '👨‍🍳 Staff Member'
                    : 'VIP Patron'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {profile.email} {profile.phone && `• ${profile.phone}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatarUrl(profile.image || '')
                  setCustomInputUrl(profile.image || '')
                  setAvatarModalOpen(true)
                }}
                className="text-[11px] font-semibold text-primary hover:text-primary-700 underline mt-1 flex items-center gap-1"
              >
                <Camera className="w-3 h-3" /> Change Photo
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-border">
              <Link href="/orders">
                <ShoppingBag className="w-3.5 h-3.5 text-primary" /> Order History
              </Link>
            </Button>
            {(profile.role === 'ADMIN' || profile.role === 'STAFF') && (
              <Button asChild size="sm" className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs gap-1.5 shadow-sm">
                <Link href="/admin">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== 'undefined') localStorage.removeItem('user_session')
                signOut({ callbackUrl: '/login' })
              }}
              className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Personal Info & Password */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground mb-4">
                Personal Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Full Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Contact Phone Number
                  </label>
                  <Input
                    placeholder="98XXXXXXXX"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    disabled
                    value={profile.email}
                    className="rounded-xl text-xs h-10 bg-muted opacity-80"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Primary login identity cannot be modified here.
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={updating}
                  size="sm"
                  className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold h-10 px-5 gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground mb-4">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="rounded-xl text-xs h-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={changingPass}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold h-10 px-4 border-border gap-2"
                >
                  {changingPass ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Saved Delivery Addresses */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Saved Delivery Addresses
                </h2>
                <Button
                  onClick={() => setNewAddressOpen(!newAddressOpen)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5 h-8 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </Button>
              </div>

              {/* Add Address Form */}
              {newAddressOpen && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3"
                >
                  <h3 className="text-xs font-bold text-foreground">Add Biratnagar Address</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-0.5">Label</label>
                      <select
                        value={newAddr.label}
                        onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg text-xs h-8 px-2"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-0.5">City</label>
                      <Input
                        disabled
                        value={newAddr.city}
                        className="h-8 text-xs bg-background/50 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">
                      Street / Landmark *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Airport Line, House #14"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="h-8 text-xs bg-background rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">
                      Area / Chowk *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Airport Road / Tintoliya"
                      value={newAddr.area}
                      onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                      className="h-8 text-xs bg-background rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewAddressOpen(false)}
                      className="text-xs h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-primary hover:bg-primary-700 text-white text-xs h-7 rounded-lg font-bold"
                    >
                      Save Address
                    </Button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-border bg-background/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-foreground font-medium mt-0.5">{addr.street}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {addr.area}, {addr.city}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Photo Change Modal */}
        <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
          <DialogContent className="max-w-lg p-6 rounded-3xl border border-border bg-card">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" /> Change Profile Picture
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Choose from our curated culinary personas, upload your own photo, or provide an image link.
              </DialogDescription>
            </DialogHeader>

            {/* Current Selection Preview */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-muted/50 border border-border my-2">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
                {selectedAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedAvatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground">
                  {selectedAvatarUrl ? 'Selected Profile Photo' : 'Default Monogram Initial'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {selectedAvatarUrl
                    ? selectedAvatarUrl.startsWith('data:')
                      ? 'Custom Uploaded Image'
                      : selectedAvatarUrl
                    : 'Displays your first name initial'}
                </p>
              </div>
              {selectedAvatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAvatarUrl('')
                    setCustomInputUrl('')
                  }}
                  className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2 rounded-xl"
                >
                  Reset
                </Button>
              )}
            </div>

            <Tabs
              value={avatarTab}
              onValueChange={(v) => setAvatarTab(v as any)}
              className="w-full mt-1"
            >
              <TabsList className="grid grid-cols-3 w-full bg-muted rounded-xl p-1 h-9">
                <TabsTrigger value="presets" className="text-xs font-semibold rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Presets
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs font-semibold rounded-lg">
                  <Upload className="w-3.5 h-3.5 mr-1" /> Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="text-xs font-semibold rounded-lg">
                  <ImageIcon className="w-3.5 h-3.5 mr-1" /> Web URL
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Presets */}
              <TabsContent value="presets" className="pt-3 space-y-3">
                <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = selectedAvatarUrl === preset.url
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedAvatarUrl(preset.url)}
                        className={`relative group rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/40 shadow-md scale-95'
                            : 'border-transparent hover:border-border'
                        }`}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <p className="text-[10px] font-medium text-foreground truncate mt-1 text-center">
                          {preset.name}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shadow">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Tab 2: Upload */}
              <TabsContent value="upload" className="pt-3 space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    Click to browse and upload photo
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Supports PNG, JPG, WebP up to 2MB
                  </p>
                </div>
              </TabsContent>

              {/* Tab 3: Custom URL */}
              <TabsContent value="url" className="pt-3 space-y-3">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1 block">
                    Image Direct URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/avatar.jpg"
                      value={customInputUrl}
                      onChange={(e) => setCustomInputUrl(e.target.value)}
                      className="text-xs h-9 rounded-xl"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!customInputUrl.trim()) return
                        setSelectedAvatarUrl(customInputUrl.trim())
                      }}
                      className="text-xs h-9 rounded-xl"
                    >
                      Preview
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Paste any public image link (Unsplash, Cloudinary, etc.)
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAvatarModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                {profile.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={savingAvatar}
                    onClick={() => handleSaveAvatar('')}
                    className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    Remove Photo
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  disabled={savingAvatar}
                  onClick={() => handleSaveAvatar(selectedAvatarUrl)}
                  className="bg-primary hover:bg-primary-700 text-white text-xs rounded-xl gap-1.5 shadow-sm"
                >
                  {savingAvatar && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save Avatar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <MiniCart />
    </div>
  )
}
