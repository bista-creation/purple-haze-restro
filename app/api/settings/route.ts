import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getRestaurantSettings,
  updateRestaurantSettings,
} from '@/lib/data/settings-store'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const settings = await getRestaurantSettings()
    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve restaurant settings.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  return handleUpdate(request)
}

export async function POST(request: Request) {
  return handleUpdate(request)
}

async function handleUpdate(request: Request) {
  try {
    const session = await auth()

    // Must be logged in as ADMIN
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Administrator clearance required to modify restaurant configurations.',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updated = await updateRestaurantSettings(body)

    return NextResponse.json({
      success: true,
      message: 'Restaurant settings saved successfully.',
      settings: updated,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update restaurant settings.' },
      { status: 500 }
    )
  }
}
