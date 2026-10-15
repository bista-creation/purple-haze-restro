'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  ShieldCheck,
  UserPlus,
  Crown,
  ChefHat,
  Search,
  Lock,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { toast } from 'sonner'
import { AppUser } from '@/lib/data/user-store'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'STAFF' | 'CUSTOMER'>('ALL')

  // Add User Modal State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF' as 'ADMIN' | 'STAFF',
  })

  // Delete Confirm State
  const [deleteUserCandidate, setDeleteUserCandidate] = useState<AppUser | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        toast.error(data.error || 'Failed to retrieve team members.')
      }
    } catch {
      toast.error('Network error loading users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchName = u.name?.toLowerCase().includes(q)
      const matchEmail = u.email?.toLowerCase().includes(q)
      const matchPhone = u.phone?.toLowerCase().includes(q)
      return matchName || matchEmail || matchPhone
    }
    return true
  })

  const adminCount = users.filter((u) => u.role === 'ADMIN').length
  const staffCount = users.filter((u) => u.role === 'STAFF').length
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length

  // Create New User / Staff / Admin
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(`Account for ${newUser.name} created as ${newUser.role}!`)
        setUsers([data.user, ...users])
        setAddModalOpen(false)
        setNewUser({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'STAFF',
        })
      } else {
        toast.error(data.error || 'Failed to create user.')
      }
    } catch {
      toast.error('Network error creating account.')
    } finally {
      setSubmitting(false)
    }
  }

  // Update Role (Promote or Demote)
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, action: 'update-role', newRole }),
      })
      const data = await res.json()

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        )
        toast.success(`Role updated to ${newRole}!`)
      } else {
        toast.error(data.error || 'Failed to update role.')
      }
    } catch {
      toast.error('Network error updating user role.')
    }
  }

  // Toggle Block / Unblock
  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, action: 'toggle-block' }),
      })
      const data = await res.json()

      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isBlocked: data.user.isBlocked } : u))
        )
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to toggle account status.')
      }
    } catch {
      toast.error('Network error updating status.')
    }
  }

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteUserCandidate) return

    try {
      const res = await fetch(`/api/admin/users?id=${deleteUserCandidate.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteUserCandidate.id))
        toast.success(`Account ${deleteUserCandidate.email} removed.`)
        setDeleteUserCandidate(null)
      } else {
        toast.error(data.error || 'Failed to delete user.')
      }
    } catch {
      toast.error('Network error deleting account.')
    }
  }

  return (
    <AdminGuard featureTitle="Team & Staff Access Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Access Control & Security
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                👑 Super Admin
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Manage Team & Staff Access
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Add new managers or kitchen operators, grant admin clearance, and manage system credentials.
            </p>
          </div>

          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary hover:bg-primary-700 text-white rounded-xl text-xs font-bold gap-2 shadow-sm h-11 px-4"
          >
            <UserPlus className="w-4 h-4" /> Add Admin or Staff Member
          </Button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Administrators
              </span>
              <p className="text-2xl font-bold text-foreground mt-0.5">{adminCount}</p>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                Full System Control
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Kitchen Staff
              </span>
              <p className="text-2xl font-bold text-foreground mt-0.5">{staffCount}</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                Orders & Stock (86)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Customers / Diners
              </span>
              <p className="text-2xl font-bold text-foreground mt-0.5">{customerCount}</p>
              <span className="text-[10px] text-primary font-bold">Public Orders</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Total Accounts
              </span>
              <p className="text-2xl font-bold text-foreground mt-0.5">{users.length}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Registered</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search user name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 text-xs rounded-xl"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                roleFilter === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('ADMIN')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                roleFilter === 'ADMIN'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              👑 Admins ({adminCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('STAFF')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                roleFilter === 'STAFF'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              👨‍🍳 Kitchen Staff ({staffCount})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('CUSTOMER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                roleFilter === 'CUSTOMER'
                  ? 'bg-neutral-800 text-white dark:bg-purple-700 shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              🍽️ Customers ({customerCount})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Loading user and staff registry...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              No accounts found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Team Member</th>
                  <th className="py-3 px-2">Contact Info</th>
                  <th className="py-3 px-2">Assigned Role</th>
                  <th className="py-3 px-2">Change Access</th>
                  <th className="py-3 px-2">Account State</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                            user.role === 'ADMIN'
                              ? 'bg-gradient-to-br from-amber-500 to-purple-800'
                              : user.role === 'STAFF'
                              ? 'bg-gradient-to-br from-emerald-600 to-indigo-800'
                              : 'bg-gradient-to-br from-neutral-600 to-neutral-800'
                          }`}
                        >
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-foreground flex items-center gap-1.5">
                            {user.name}
                            {user.email === 'admin@purplehaze.com' && (
                              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                                Primary Admin
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-2">
                      <span className="text-foreground font-medium">
                        {user.phone || 'No phone recorded'}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                            : user.role === 'STAFF'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {user.role === 'ADMIN' && <Crown className="w-3 h-3 text-amber-500" />}
                        {user.role === 'STAFF' && <ChefHat className="w-3 h-3 text-emerald-500" />}
                        {user.role}
                      </span>
                    </td>

                    {/* Quick Role Switcher */}
                    <td className="py-3.5 px-2">
                      {user.email === 'admin@purplehaze.com' ? (
                        <span className="text-[10px] text-muted-foreground font-medium italic">
                          Protected Role
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-background border border-border rounded-xl h-8 px-2 text-[11px] text-foreground font-semibold cursor-pointer hover:border-primary focus:border-primary"
                        >
                          <option value="ADMIN">👑 Grant Admin</option>
                          <option value="STAFF">👨‍🍳 Assign Staff</option>
                          <option value="CUSTOMER">🍽️ Demote to Customer</option>
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-2">
                      <button
                        type="button"
                        disabled={user.email === 'admin@purplehaze.com'}
                        onClick={() => handleToggleBlock(user.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          user.isBlocked
                            ? 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        } ${user.email === 'admin@purplehaze.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      {user.email !== 'admin@purplehaze.com' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteUserCandidate(user)}
                          className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-500/10 rounded-lg"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold px-2 py-1">
                          Owner
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ----------------- ADD ADMIN OR STAFF MODAL ----------------- */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-3xl bg-background border border-border">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Add Team Member or Admin
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4 my-2">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Full Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Suresh Shrestha"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Email Address *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="suresh@purplehaze.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Temporary Password *
                </label>
                <Input
                  required
                  type="password"
                  placeholder="Min 6 characters (e.g. Staff@2026)"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">
                  Role & Clearance Level *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'STAFF' })
                  }
                  className="w-full bg-background border border-border rounded-xl h-10 px-3 text-xs text-foreground font-bold"
                >
                  <option value="STAFF">👨‍🍳 Kitchen Staff (Orders Queue & Stock 86)</option>
                  <option value="ADMIN">👑 Full Administrator (Complete System Access)</option>
                </select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Admins can edit recipes, prices, promotions, and add other users. Staff have access to live kitchen queue and 86 stock toggles.
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-700 text-white text-xs font-bold h-11 rounded-xl shadow-md mt-2"
              >
                {submitting ? 'Creating Account...' : 'Create Team Account'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ----------------- DELETE USER CONFIRM DIALOG ----------------- */}
        <Dialog open={!!deleteUserCandidate} onOpenChange={() => setDeleteUserCandidate(null)}>
          <DialogContent className="max-w-md p-6 rounded-3xl bg-background border border-border text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <DialogTitle className="font-serif text-xl font-bold">
              Remove Account Access?
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-2 mb-6">
              Are you sure you want to remove <strong className="text-foreground">{deleteUserCandidate?.email}</strong>? They will no longer be able to sign in to Purple Haze.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteUserCandidate(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUser}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Remove
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  )
}
