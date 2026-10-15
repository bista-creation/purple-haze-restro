import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getAllUsers,
  createUserWithRole,
  updateUserRole,
  toggleUserBlock,
  deleteUser,
} from '@/lib/data/user-store'
import type { Role } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    // Must be ADMIN to list all accounts and credentials metadata
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privilege required.' },
        { status: 403 }
      )
    }

    const users = await getAllUsers()
    return NextResponse.json({ success: true, count: users.length, users })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve user registry.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privilege required to create team members.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, password, phone, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const targetRole: Role = (role === 'ADMIN' || role === 'STAFF') ? role : 'CUSTOMER'

    const user = await createUserWithRole({
      name,
      email,
      password,
      phone,
      role: targetRole,
    })

    const { passwordHash, ...safeUser } = user
    return NextResponse.json({ success: true, user: safeUser }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create user account.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privilege required to modify user roles.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, action, newRole } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 })
    }

    if (action === 'toggle-block') {
      const user = await toggleUserBlock(id)
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
      }
      const { passwordHash, ...safeUser } = user
      return NextResponse.json({
        success: true,
        message: `Account status updated to ${user.isBlocked ? 'Blocked' : 'Active'}.`,
        user: safeUser,
      })
    }

    if (action === 'update-role') {
      if (!newRole || !['ADMIN', 'STAFF', 'CUSTOMER'].includes(newRole)) {
        return NextResponse.json({ success: false, error: 'Valid role is required.' }, { status: 400 })
      }

      const user = await updateUserRole(id, newRole as Role)
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
      }
      const { passwordHash, ...safeUser } = user
      return NextResponse.json({
        success: true,
        message: `User role updated to ${newRole}.`,
        user: safeUser,
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action provided.' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update user.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privilege required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 })
    }

    await deleteUser(id)
    return NextResponse.json({ success: true, message: 'Account removed successfully.' })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to remove user account.' },
      { status: 400 }
    )
  }
}
