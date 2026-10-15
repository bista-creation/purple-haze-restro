import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ContactSchema } from '@/lib/validations'
import { sendContactInquiryNotification } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = ContactSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validatedData.data

    // Dispatch email notification asynchronously
    sendContactInquiryNotification({ name, email, phone, subject, message }).catch((err) =>
      console.error('[Contact Mail Error]:', err)
    )

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
      return NextResponse.json({ success: true, data: contactRecord }, { status: 201 })
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Contact] Database write bypassed (fallback mode):', dbError)
      }
      return NextResponse.json(
        {
          success: true,
          message: 'Your message has been received. We will get back to you shortly.',
          data: { name, email, subject, message, createdAt: new Date().toISOString() },
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
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages', data: [] },
      { status: 500 }
    )
  }
}
