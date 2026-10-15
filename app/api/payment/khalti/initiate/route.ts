import { NextResponse } from 'next/server'
import { initiateKhaltiPayment, getAppBaseUrl } from '@/lib/payment'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderNumber, totalAmount, customer } = body

    if (!orderNumber || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'orderNumber and totalAmount are required' },
        { status: 400 }
      )
    }

    const baseUrl = getAppBaseUrl(req)

    const paymentResult = await initiateKhaltiPayment({
      orderNumber,
      totalAmount: parseFloat(totalAmount),
      customer: {
        name: customer?.name || 'Walk-in Guest',
        email: customer?.email || null,
        phone: customer?.phone || '9800000000',
      },
      baseUrl,
    })

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.error || 'Failed to initiate Khalti payment' },
        { status: 502 }
      )
    }

    // Record pidx reference in DB
    try {
      await prisma.payment.upsert({
        where: { orderId: orderNumber },
        update: {
          method: 'KHALTI',
          gatewayRef: paymentResult.pidx,
          amount: parseFloat(totalAmount),
          status: 'PENDING',
        },
        create: {
          order: { connect: { orderNumber } },
          method: 'KHALTI',
          gatewayRef: paymentResult.pidx,
          amount: parseFloat(totalAmount),
          status: 'PENDING',
        },
      })
    } catch (dbErr) {
      console.warn('[Khalti Initiate DB Notice]:', dbErr)
    }

    return NextResponse.json({
      success: true,
      pidx: paymentResult.pidx,
      paymentUrl: paymentResult.paymentUrl,
      simulated: paymentResult.simulated || false,
    })
  } catch (err: any) {
    console.error('[Khalti Initiate Exception]:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to initialize Khalti' },
      { status: 500 }
    )
  }
}
