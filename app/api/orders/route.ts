import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderPlacedEmail } from '@/lib/email'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const DATA_DIR = path.join(process.cwd(), '.data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    } catch {
      // Ignore
    }
  }
}

function loadOrdersFromFile(): any[] {
  ensureDataDir()
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Ignore read errors
  }
  return []
}

function saveOrderToFile(order: any) {
  ensureDataDir()
  try {
    const list = loadOrdersFromFile()
    const index = list.findIndex(
      (o) => o.orderNumber === order.orderNumber || o.id === order.id
    )
    if (index >= 0) {
      list[index] = { ...list[index], ...order }
    } else {
      list.unshift(order)
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list.slice(0, 200), null, 2), 'utf-8')
  } catch {
    // Ignore write errors
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customer,
      orderType,
      items,
      pricing,
      paymentMethod,
      tableNumber,
      deliveryZone,
      address,
      orderNotes,
      scheduledTime,
    } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot create order with empty cart' },
        { status: 400 }
      )
    }

    const orderNumber = generateOrderNumber()

    try {
      // Try database transaction
      const order = await prisma.order.create({
        data: {
          orderNumber,
          guestName: customer?.name || 'Walk-in Guest',
          guestPhone: customer?.phone || '',
          guestEmail: customer?.email || null,
          orderType: orderType || 'DELIVERY',
          status: 'PLACED',
          notes: orderNotes || null,
          subtotal: pricing?.subtotal || 0,
          deliveryFee: pricing?.deliveryFee || 0,
          taxAmount: pricing?.tax || 0,
          discountAmount: pricing?.discount || 0,
          totalAmount: pricing?.total || 0,
          deliveryAddress: address || null,
          estimatedTime: 35,
          items: {
            create: items.map((item: any) => ({
              dishId: item.dishId || 'demo-dish',
              dishName: item.dishName || 'Dish',
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              variantName: item.variantName || null,
              selectedAddOns: item.selectedAddOns || [],
              specialNote: item.specialNote || null,
              totalPrice: item.totalPrice || item.unitPrice * item.quantity,
            })),
          },
          statusHistory: {
            create: {
              status: 'PLACED',
              note: 'Order submitted by customer',
            },
          },
          payment: {
            create: {
              method: paymentMethod || 'CASH_ON_DELIVERY',
              status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
              amount: pricing?.total || 0,
              gatewayRef: paymentMethod !== 'CASH_ON_DELIVERY' ? `TXN-${Date.now()}` : null,
            },
          },
        },
        include: {
          items: true,
          payment: true,
          statusHistory: true,
        },
      })

      // Also persist backup copy
      saveOrderToFile(order)

      // Dispatch order confirmation email asynchronously
      if (customer?.email) {
        sendOrderPlacedEmail({
          orderNumber,
          customerEmail: customer.email,
          customerName: customer.name || 'Valued Diner',
          orderType: orderType || 'DELIVERY',
          items: items.map((i: any) => ({
            dishName: i.dishName || 'Dish',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice || i.unitPrice * i.quantity,
          })),
          pricing: {
            subtotal: pricing?.subtotal || 0,
            deliveryFee: pricing?.deliveryFee || 0,
            discount: pricing?.discount || 0,
            total: pricing?.total || 0,
          },
          paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        }).catch((err) => console.error('[Order Mail Error]:', err))
      }

      return NextResponse.json({ success: true, data: order }, { status: 201 })
    } catch (dbError) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Orders] Database write fallback triggered:', dbError)
      }
      // DB offline fallback — generate a persistent fallback order
      const fallbackOrder = {
        id: 'ord_' + Math.random().toString(36).substring(2, 9),
        orderNumber,
        customer,
        orderType,
        items: items.map((item: any) => ({
          dishId: item.dishId || 'demo-dish',
          dishName: item.dishName || 'Dish',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          variantName: item.variantName || null,
          selectedAddOns: item.selectedAddOns || [],
          specialNote: item.specialNote || null,
          totalPrice: item.totalPrice || item.unitPrice * item.quantity,
        })),
        pricing,
        payment: {
          method: paymentMethod || 'CASH_ON_DELIVERY',
          status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
          amount: pricing?.total || 0,
        },
        status: 'PLACED',
        deliveryAddress: address || null,
        estimatedTime: 35,
        createdAt: new Date().toISOString(),
      }

      saveOrderToFile(fallbackOrder)

      if (customer?.email) {
        sendOrderPlacedEmail({
          orderNumber,
          customerEmail: customer.email,
          customerName: customer.name || 'Valued Diner',
          orderType: orderType || 'DELIVERY',
          items: items.map((i: any) => ({
            dishName: i.dishName || 'Dish',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice || i.unitPrice * i.quantity,
          })),
          pricing: {
            subtotal: pricing?.subtotal || 0,
            deliveryFee: pricing?.deliveryFee || 0,
            discount: pricing?.discount || 0,
            total: pricing?.total || 0,
          },
          paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        }).catch((err) => console.error('[Order Mail Error]:', err))
      }

      return NextResponse.json({ success: true, data: fallbackOrder }, { status: 200 })
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Orders] Order creation error:', error)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to place order. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('orderNumber')

  if (orderNumber) {
    // 1. Try Prisma first
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, payment: true, statusHistory: true },
      })
      if (order) {
        return NextResponse.json({ success: true, data: order })
      }
    } catch {
      // Prisma offline, proceed to file store
    }

    // 2. Check file store fallback
    const localOrders = loadOrdersFromFile()
    const found = localOrders.find(
      (o) => o.orderNumber?.toUpperCase() === orderNumber.toUpperCase()
    )
    if (found) {
      return NextResponse.json({ success: true, data: found })
    }

    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  // Listing all orders
  try {
    const orders = await prisma.order.findMany({
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    // Database offline, load from file store
    const localOrders = loadOrdersFromFile()
    return NextResponse.json({ success: true, data: localOrders })
  }
}
