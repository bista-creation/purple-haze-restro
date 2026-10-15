import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  findUserByEmail,
  updateUserProfile,
  changeUserPassword,
  createUserWithRole,
} from '@/lib/data/user-store'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to view your profile.' },
        { status: 401 }
      )
    }

    let user = await findUserByEmail(session.user.email)
    if (!user) {
      // Auto-register authenticated OAuth user (e.g. Google) into local store
      user = await createUserWithRole({
        name: session.user.name || 'Valued Guest',
        email: session.user.email,
        role: session.user.email.toLowerCase() === 'admin@purplehaze.com' ? 'ADMIN' : 'CUSTOMER',
        image: session.user.image || undefined,
      })
    } else if (!user.image && session.user.image) {
      // Link Google avatar if account has no custom picture yet
      const updated = await updateUserProfile(session.user.email, { image: session.user.image })
      if (updated) user = updated
    }

    const { passwordHash, ...safeUser } = user
    return NextResponse.json({ success: true, user: safeUser })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve user profile.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, name, phone, addresses, currentPassword, newPassword } = body

    if (action === 'change-password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Both current password and new password are required.' },
          { status: 400 }
        )
      }

      const result = await changeUserPassword(
        session.user.email,
        currentPassword,
        newPassword
      )

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully.',
      })
    }

    if (action === 'update-addresses') {
      const updated = await updateUserProfile(session.user.email, { addresses })
      if (!updated) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
      }

      const { passwordHash, ...safeUser } = updated
      return NextResponse.json({
        success: true,
        message: 'Delivery address book saved.',
        user: safeUser,
      })
    }

    if (action === 'update-avatar') {
      const updated = await updateUserProfile(session.user.email, { image: body.image || '' })
      if (!updated) {
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
      }

      const { passwordHash, ...safeUser } = updated
      return NextResponse.json({
        success: true,
        message: 'Profile picture updated successfully.',
        user: safeUser,
      })
    }

    // Default: update personal info
    const updated = await updateUserProfile(session.user.email, {
      name,
      phone,
      image: body.image,
    })

    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 })
    }

    const { passwordHash, ...safeUser } = updated
    return NextResponse.json({
      success: true,
      message: 'Profile details updated successfully.',
      user: safeUser,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update profile.' },
      { status: 500 }
    )
  }
}
