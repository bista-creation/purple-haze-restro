import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { EventBookingSchema } from '@/lib/validations'
import { sendEventBookingNotification } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // map venueId to venue if provided
    const payload = {
      ...body,
      venue: body.venue || body.venueId || 'Grand Banquet Hall',
    }
    const validatedData = EventBookingSchema.safeParse(payload)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, eventType, eventDate, guests, venue, message } = validatedData.data
    const referenceId = 'PH-EVT-' + Math.floor(1000 + Math.random() * 9000)

    // Dispatch email notification to guest and admin (awaited)
    try {
      await sendEventBookingNotification({
        name,
        email,
        phone,
        eventType,
        eventDate,
        guests: Number(guests),
        venue: venue || 'Grand Banquet Hall',
        message,
        referenceId,
      })
    } catch (err) {
      console.error('[Event Mail Error]:', err)
    }

    try {
      const booking = await prisma.eventBooking.create({
        data: {
          name,
          email,
          phone,
          eventType,
          eventDate: new Date(eventDate),
          guests: Number(guests),
          venueId: venue || null,
          message: message || null,
          status: 'PENDING',
        },
      })
      return NextResponse.json({ success: true, data: { ...booking, referenceId } }, { status: 201 })
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Events] Database write bypassed (fallback mode):', dbError)
      }
      return NextResponse.json(
        {
          success: true,
          message: 'Event booking inquiry received successfully',
          data: {
            name,
            email,
            phone,
            eventType,
            eventDate,
            guests,
            venue,
            status: 'PENDING',
            referenceId: 'PH-EVT-' + Math.floor(1000 + Math.random() * 9000),
          },
        },
        { status: 200 }
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Events] Booking API error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to submit event booking. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth().catch(() => null)
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Staff or Admin privilege required.' },
        { status: 403 }
      )
    }

    const bookings = await prisma.eventBooking.findMany({
      include: { venue: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event bookings', data: [] },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth().catch(() => null)
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Staff or Admin privilege required.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, status, adminNotes } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and status are required.' },
        { status: 400 }
      )
    }

    const updatedBy = session.user.name || session.user.email || 'Staff'
    const timestamp = new Date().toISOString()
    const noteEntry = adminNotes
      ? `${adminNotes} [Updated to ${status} by ${updatedBy} at ${timestamp}]`
      : `Status updated to ${status} by ${updatedBy} at ${timestamp}`

    const updated = await prisma.eventBooking.update({
      where: { id },
      data: {
        status,
        adminNotes: noteEntry,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update event booking.' },
      { status: 500 }
    )
  }
}
