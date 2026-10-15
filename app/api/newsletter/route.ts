import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendNewsletterWelcomeEmail } from '@/lib/email'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), '.data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch {
      // Ignore
    }
  }
}

function loadSubscribersFromFile(): any[] {
  ensureDataDir()
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const content = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore
  }
  return []
}

function saveSubscriberToFile(subscriber: any) {
  ensureDataDir()
  try {
    const list = loadSubscribersFromFile()
    const index = list.findIndex(
      (s) => s.email?.toLowerCase() === subscriber.email?.toLowerCase()
    )
    if (index >= 0) {
      list[index] = { ...list[index], ...subscriber }
    } else {
      list.unshift(subscriber)
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2), 'utf-8')
  } catch {
    // Ignore
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body.email?.trim().toLowerCase()

    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    let isNew = true

    // 1. Save to Database
    try {
      const existing = await prisma.newsletter.findUnique({ where: { email } })
      if (existing) {
        isNew = false
      } else {
        await prisma.newsletter.create({
          data: { email, isActive: true },
        })
      }
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Newsletter] Database sync fallback:', dbError)
      }
      // Check local file store
      const localList = loadSubscribersFromFile()
      if (localList.some((s) => s.email?.toLowerCase() === email)) {
        isNew = false
      }
    }

    // Always backup to local store
    saveSubscriberToFile({
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      email,
      isActive: true,
      createdAt: new Date().toISOString(),
    })

    // 2. Dispatch Welcome Email
    if (isNew) {
      try {
        await sendNewsletterWelcomeEmail(email)
      } catch (mailErr) {
        console.error('[Newsletter Mail Error]:', mailErr)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: isNew
          ? 'Welcome to the Purple Haze VIP Club! Your 10% promo voucher has been sent to your inbox.'
          : "You're already a VIP member! Use code VIPWELCOME10 for 10% off your next order.",
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const list = await prisma.newsletter.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, subscribers: list })
  } catch {
    const fallback = loadSubscribersFromFile()
    return NextResponse.json({ success: true, subscribers: fallback })
  }
}
