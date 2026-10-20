import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ContactSchema } from '@/lib/validations'
import { sendContactInquiryNotification } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = ContactSchema.safeParse(body)

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors
      const firstError =
        Object.values(fieldErrors).flat()[0] || 'Please provide all required fields.'
      return NextResponse.json(
        { success: false, error: firstError, errors: fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validatedData.data
    const inquirySubject = subject || 'General Inquiry'

    // Dispatch email notification to admin (awaited so serverless execution context does not terminate early)
    let emailStatus: any = { dispatched: false }
    try {
      const emailResult = await sendContactInquiryNotification({
        name,
        email,
        phone,
        subject: inquirySubject,
        message,
      })
      emailStatus = { dispatched: true, ...emailResult }
    } catch (mailErr) {
      console.error('[Contact Mail Error]:', mailErr)
      emailStatus = { dispatched: false, error: String(mailErr) }
    }

    try {
      const contactRecord = await prisma.contactMessage.create({
        data: {
          name,
          email,
          phone: phone || null,
          subject: subject || 'General Inquiry',
          message,
        },
      })
      return NextResponse.json({ success: true, data: contactRecord, emailStatus }, { status: 201 })
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Contact] Database write bypassed (fallback mode):', dbError)
      }
      return NextResponse.json(
        {
          success: true,
          message: 'Your message has been received. We will get back to you shortly.',
          data: { name, email, subject, message, createdAt: new Date().toISOString() },
          emailStatus,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Contact] API error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
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

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages', data: [] },
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
    const { id, isReplied, isRead } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required.' }, { status: 400 })
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        ...(isReplied !== undefined ? { isReplied: Boolean(isReplied) } : {}),
        ...(isRead !== undefined ? { isRead: Boolean(isRead) } : {}),
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update contact message status.' },
      { status: 500 }
    )
  }
}
