import { NextResponse } from 'next/server'
import { verifyKhaltiPayment, getAppBaseUrl } from '@/lib/payment'
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
          method: 'KHALTI',
          transactionId,
          paidAt: new Date().toISOString(),
        }
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf-8')
      }
    }
  } catch (err) {
    console.warn('[Khalti Callback] Local file update skipped:', err)
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const baseUrl = getAppBaseUrl(req)

  const pidx = url.searchParams.get('pidx')
  const statusParam = url.searchParams.get('status')
  const txnIdParam = url.searchParams.get('txnId') || url.searchParams.get('transaction_id')
  const purchaseOrderId = url.searchParams.get('purchase_order_id')

  if (!pidx) {
    console.error('[Khalti Callback]: Missing pidx parameter')
    return NextResponse.redirect(`${baseUrl}/checkout?error=khalti_missing_pidx`)
  }

  // Verify transaction status with Khalti lookup
  const isSimulator = pidx.startsWith('k_sim_')
  const verification = await verifyKhaltiPayment(pidx)

  // Enforce strict cryptographic gateway verification for live/real transactions
  const isApproved = isSimulator ? statusParam === 'Completed' : verification.success

  if (!isApproved) {
    console.error('[Khalti Callback]: Verification failed:', verification.error || 'Transaction not approved by gateway')
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=khalti_failed&reason=${encodeURIComponent(
        verification.error || 'Payment was not verified by Khalti'
      )}`
    )
  }

  // Order reference lookup
  const orderNumber = purchaseOrderId || (await findOrderNumberByPidx(pidx))
  const transactionId = txnIdParam || verification.transactionId || pidx

  if (!orderNumber) {
    console.error('[Khalti Callback]: Could not associate transaction with order number:', pidx)
    return NextResponse.redirect(`${baseUrl}/?payment=khalti_success_unknown_order`)
  }

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
              method: 'KHALTI',
              transactionId,
              gatewayRef: pidx,
              paidAt: new Date(),
            },
            create: {
              status: 'PAID',
              method: 'KHALTI',
              transactionId,
              gatewayRef: pidx,
              amount: verification.totalAmount || 0,
              paidAt: new Date(),
            },
          },
        },
        statusHistory: {
          create: {
            status: 'CONFIRMED',
            note: `Payment completed via Khalti (Txn: ${transactionId})`,
          },
        },
      },
      include: {
        items: true,
        payment: true,
      },
    })
  } catch (dbErr) {
    console.warn('[Khalti Callback DB Notice]:', dbErr)
  }

  // 2. Update local file backup
  updateLocalOrder(orderNumber, transactionId)

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
        paymentMethod: 'KHALTI (PAID)',
      })
    } catch (mailErr) {
      console.error('[Khalti Order Email Error]:', mailErr)
    }
  }

  // 4. Redirect to Order Confirmation screen
  return NextResponse.redirect(
    `${baseUrl}/order-confirmation/${orderNumber}?payment=success&method=khalti&pidx=${pidx}`
  )
}

async function findOrderNumberByPidx(pidx: string): Promise<string | null> {
  try {
    const payment = await prisma.payment.findFirst({
      where: { gatewayRef: pidx },
      include: { order: true },
    })
    return payment?.order?.orderNumber || null
  } catch {
    return null
  }
}
