import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, registerNewUser } from '@/lib/data/user-store'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = body

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Register user
    const newUser = await registerNewUser({
      name,
      email,
      password,
      phone: phone || '',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully!',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
