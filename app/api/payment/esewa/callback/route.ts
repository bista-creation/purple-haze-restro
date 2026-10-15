import { NextResponse } from 'next/server'
import { verifyEsewaPayment, getAppBaseUrl } from '@/lib/payment'
import prisma from '@/lib/prisma'
import { sendOrderPlacedEmail } from '@/lib/email'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function updateLocalOrder(orderNumber: string, transactionId: string) {
  try {
    const dataDir = path.join(process.cwd(), '.data')
    const ordersFile = path.join(dataDir, 'orders.json')
    if (fs.existsSync(ordersFile)) {
      const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'))
      const index = orders.findIndex((o: any) => o.orderNumber === orderNumber)
      if (index >= 0) {
        orders[index].status = 'CONFIRMED'
        orders[index].payment = {
          ...orders[index].payment,
          status: 'PAID',
          method: 'ESEWA',
          transactionId,
          paidAt: new Date().toISOString(),
        }
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8')
      }
    }
  } catch (err) {
    console.warn('[eSewa Callback] Local file update skipped:', err)
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const baseUrl = getAppBaseUrl(req)
  const dataParam = url.searchParams.get('data')

  if (!dataParam) {
    console.error('[eSewa Callback]: Missing data query parameter')
    return NextResponse.redirect(`${baseUrl}/checkout?error=esewa_missing_data`)
  }

  const verification = await verifyEsewaPayment(dataParam)

  if (!verification.success || !verification.orderNumber) {
    console.error('[eSewa Callback]: Verification failed:', verification.error)
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=esewa_verification_failed&reason=${encodeURIComponent(
        verification.error || 'Failed'
      )}`
    )
  }

  const orderNumber = verification.orderNumber
  const transactionCode = verification.transactionCode || 'ESEWA-' + Date.now()

  // 1. Update Database
  let updatedOrder: any = null
  try {
    updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        status: 'CONFIRMED',
        payment: {
          upsert: {
            update: {
              status: 'PAID',
              method: 'ESEWA',
              transactionId: transactionCode,
              paidAt: new Date(),
            },
            create: {
              status: 'PAID',
              method: 'ESEWA',
              transactionId: transactionCode,
              amount: verification.totalAmount || 0,
              paidAt: new Date(),
            },
          },
        },
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: `Payment completed via eSewa (Ref: ${transactionCode})`,
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    })
  } catch (dbErr) {
    console.warn('[eSewa Callback DB Notice]:', dbErr)
  }

  // 2. Update local file backup
  updateLocalOrder(orderNumber, transactionCode)

  // 3. Dispatch Email Confirmation
  if (updatedOrder && updatedOrder.guestEmail) {
    try {
      await sendOrderPlacedEmail({
        orderNumber,
        customerEmail: updatedOrder.guestEmail,
        customerName: updatedOrder.guestName || 'Valued Diner',
        orderType: updatedOrder.orderType,
        items: updatedOrder.items.map((i: any) => ({
          dishName: i.dishName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        pricing: {
          subtotal: updatedOrder.subtotal,
          deliveryFee: updatedOrder.deliveryFee,
          discount: updatedOrder.discountAmount,
          total: updatedOrder.totalAmount,
        },
        paymentMethod: 'ESEWA (PAID)',
      })
    } catch (mailErr) {
      console.error('[eSewa Order Email Error]:', mailErr)
    }
  }

  // 4. Redirect to Order Confirmation screen
  return NextResponse.redirect(
    `${baseUrl}/order-confirmation/${orderNumber}?payment=success&method=esewa&ref=${transactionCode}`
  )
}

export async function POST(req: Request) {
  // Support both GET and POST callbacks
  return GET(req)
}
