import { NextResponse } from 'next/server'
import { createEsewaPaymentPayload, getAppBaseUrl } from '@/lib/payment'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderNumber, totalAmount, deliveryFee } = body

    if (!orderNumber || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'orderNumber and totalAmount are required' },
        { status: 400 }
      )
    }

    const baseUrl = getAppBaseUrl(req)

    // Verify order exists or create payment record
    try {
      await prisma.payment.upsert({
        where: { orderId: orderNumber },
        update: {
          method: 'ESEWA',
          amount: parseFloat(totalAmount),
          status: 'PENDING',
        },
        create: {
          order: { connect: { orderNumber } },
          method: 'ESEWA',
          amount: parseFloat(totalAmount),
          status: 'PENDING',
        },
      })
    } catch (dbErr) {
      console.warn('[eSewa Initiate DB Sync Notice]:', dbErr)
    }

    const payload = createEsewaPaymentPayload({
      orderNumber,
      totalAmount: parseFloat(totalAmount),
      deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
      baseUrl,
    })

    return NextResponse.json({
      success: true,
      formUrl: payload.formUrl,
      fields: payload.fields,
    })
  } catch (err: any) {
    console.error('[eSewa Initiate Exception]:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to initialize eSewa transaction' },
      { status: 500 }
    )
  }
}
