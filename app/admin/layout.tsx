import React from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Strict Server-Side Security:
  // Reject unauthenticated visitors or regular CUSTOMER accounts
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
    redirect('/login?callbackUrl=/admin&error=AccessDenied')
  }

  const role = session.user.role
  const name = session.user.name || (role === 'ADMIN' ? 'Administrator' : 'Kitchen Staff')
  const email = session.user.email || ''

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AdminSidebar userRole={role} userName={name} userEmail={email} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userRole={role} userName={name} userEmail={email} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
