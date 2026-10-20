import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderPlacedEmail } from '@/lib/email'
import { sendWhatsAppOrderAlert, getWhatsAppOrderUrl, ADMIN_WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { DISHES_DATA } from '@/lib/data/restaurant-data'
import { ensureDbMenuInitialized } from '@/lib/data/menu-store'
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
      // Ignore read-only filesystem in serverless environments
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
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list.slice(0, 300), null, 2), 'utf-8')
  } catch {
    // Ignore write errors in serverless environments
  }
}

async function ensureDishesExistForOrder(items: any[]) {
  try {
    await ensureDbMenuInitialized()

    let defaultCat = await prisma.category.findFirst()
    if (!defaultCat) {
      defaultCat = await prisma.category.create({
        data: {
          id: 'cat-nepali',
          name: 'Nepali Classics',
          slug: 'nepali',
          cuisine: 'nepali',
        },
      })
    }

    for (const item of items) {
      const dishId = item.dishId || item.id || `dish-${Date.now()}`
      item.dishId = dishId

      const existingDish = await prisma.dish.findUnique({
        where: { id: dishId },
      })

      if (!existingDish) {
        const localDish = DISHES_DATA.find((d) => d.id === dishId)
        let catId = localDish?.categoryId || defaultCat.id
        const catExists = await prisma.category.findUnique({ where: { id: catId } })
        if (!catExists) {
          catId = defaultCat.id
        }

        await prisma.dish.create({
          data: {
            id: dishId,
            name: item.dishName || localDish?.name || 'Chef Special Dish',
            slug: `${(item.dishName || 'dish').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`,
            description: localDish?.description || '',
            price: Number(item.unitPrice || localDish?.price || 100),
            image: localDish?.image || '/images/food-presentation.jpg',
            categoryId: catId,
            isAvailable: true,
          },
        })
      }
    }
  } catch (err) {
    console.warn('[Orders] ensureDishesExistForOrder warning:', err)
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

    // 1. Ensure foreign key dishes exist in PostgreSQL database
    await ensureDishesExistForOrder(items)

    try {
      // 2. Insert into PostgreSQL (Neon)
      const order = await prisma.order.create({
        data: {
          orderNumber,
          guestName: customer?.name || 'Walk-in Guest',
          guestPhone: customer?.phone || '',
          guestEmail: customer?.email || null,
          orderType: orderType || 'DELIVERY',
          status: 'PLACED',
          notes: orderNotes || null,
          subtotal: Number(pricing?.subtotal || 0),
          deliveryFee: Number(pricing?.deliveryFee || 0),
          taxAmount: Number(pricing?.tax || 0),
          discountAmount: Number(pricing?.discount || 0),
          totalAmount: Number(pricing?.total || 0),
          deliveryAddress: address || null,
          estimatedTime: 35,
          items: {
            create: items.map((item: any) => ({
              dishId: item.dishId,
              dishName: item.dishName || 'Dish',
              quantity: Number(item.quantity) || 1,
              unitPrice: Number(item.unitPrice) || 0,
              variantName: item.variantName || null,
              selectedAddOns: item.selectedAddOns || [],
              specialNote: item.specialNote || null,
              totalPrice:
                Number(item.totalPrice) ||
                (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
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
              amount: Number(pricing?.total || 0),
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

      // Send WhatsApp Order Alert to 9851150987
      try {
        await sendWhatsAppOrderAlert({
          ...order,
          customer,
          pricing,
          tableNumber,
          address,
          orderNotes,
        })
      } catch (waErr) {
        console.warn('[WhatsApp Notification Error]:', waErr)
      }

      // Dispatch order confirmation email (awaited)
      if (customer?.email) {
        try {
          await sendOrderPlacedEmail({
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
          })
        } catch (err) {
          console.error('[Order Mail Error]:', err)
        }
      }

      const whatsAppUrl = getWhatsAppOrderUrl({
        ...order,
        customer,
        pricing,
        tableNumber,
        address,
        orderNotes,
      })

      return NextResponse.json({ success: true, data: order, whatsAppUrl }, { status: 201 })
    } catch (dbError) {
      console.warn('[Orders] Database write fallback triggered:', dbError)

      // DB offline fallback — generate a persistent fallback order
      const fallbackOrder = {
        id: 'ord_' + Math.random().toString(36).substring(2, 9),
        orderNumber,
        customer,
        guestName: customer?.name || 'Walk-in Guest',
        guestPhone: customer?.phone || '',
        guestEmail: customer?.email || null,
        orderType: orderType || 'DELIVERY',
        tableNumber: tableNumber || null,
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
        subtotal: pricing?.subtotal || 0,
        deliveryFee: pricing?.deliveryFee || 0,
        discountAmount: pricing?.discount || 0,
        totalAmount: pricing?.total || 0,
        total: pricing?.total || 0,
        payment: {
          method: paymentMethod || 'CASH_ON_DELIVERY',
          status: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
          amount: pricing?.total || 0,
          gatewayRef: paymentMethod !== 'CASH_ON_DELIVERY' ? `TXN-${Date.now()}` : null,
        },
        status: 'PLACED',
        deliveryAddress: address || null,
        notes: orderNotes || null,
        createdAt: new Date().toISOString(),
      }

      saveOrderToFile(fallbackOrder)

      // Send WhatsApp Order Alert to 9851150987
      try {
        await sendWhatsAppOrderAlert(fallbackOrder)
      } catch (waErr) {
        console.warn('[WhatsApp Notification Error]:', waErr)
      }

      // Dispatch order confirmation email (awaited)
      if (customer?.email) {
        try {
          await sendOrderPlacedEmail({
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
          })
        } catch (err) {
          console.error('[Order Mail Error]:', err)
        }
      }

      const whatsAppUrl = getWhatsAppOrderUrl(fallbackOrder)

      return NextResponse.json({ success: true, data: fallbackOrder, whatsAppUrl }, { status: 200 })
    }
  } catch (error) {
    console.error('[Orders] Order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to place order. Please try again.' },
      { status: 500 }
    )
  }
}

function maskPii(val?: string | null): string {
  if (!val) return ''
  const trimmed = val.trim()
  if (trimmed.length <= 4) return '***'
  const visibleStart = trimmed.slice(0, 2)
  const visibleEnd = trimmed.slice(-2)
  return `${visibleStart}****${visibleEnd}`
}

function sanitizeOrderForPublic(order: any) {
  if (!order || typeof order !== 'object') return order

  const safe = { ...order }
  if (safe.customer) {
    safe.customer = {
      name: maskPii(safe.customer.name),
      phone: maskPii(safe.customer.phone),
      email: maskPii(safe.customer.email),
    }
  }
  if (safe.guestName) safe.guestName = maskPii(safe.guestName)
  if (safe.guestPhone) safe.guestPhone = maskPii(safe.guestPhone)
  if (safe.guestEmail) safe.guestEmail = maskPii(safe.guestEmail)

  // Mask exact street address while keeping neighborhood/city for tracking context
  if (safe.deliveryAddress && typeof safe.deliveryAddress === 'object') {
    safe.deliveryAddress = {
      area: safe.deliveryAddress.area || 'Biratnagar',
      city: safe.deliveryAddress.city || 'Biratnagar',
      street: '*** Address Confirmed on File ***',
    }
  }
  return safe
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('orderNumber')
  const phone = searchParams.get('phone')?.trim()

  const session = await auth().catch(() => null)
  const isStaffOrAdmin =
    session?.user && (session.user.role === 'ADMIN' || session.user.role === 'STAFF')

  if (orderNumber) {
    let order: any = null

    // 1. Try Prisma first
    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true, payment: true, statusHistory: { orderBy: { createdAt: 'desc' } } },
      })
    } catch {
      // Prisma offline, proceed to file store
    }

    // 2. Check file store fallback
    if (!order) {
      const localOrders = loadOrdersFromFile()
      order = localOrders.find(
        (o) =>
          o.orderNumber?.toUpperCase() === orderNumber.toUpperCase() ||
          o.id?.toUpperCase() === orderNumber.toUpperCase()
      )
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Authorization & IDOR protection:
    // 1. Admin or Staff -> Full access
    if (isStaffOrAdmin) {
      return NextResponse.json({ success: true, data: order })
    }

    // 2. Authenticated customer who placed the order -> Full access
    const userEmail = session?.user?.email?.toLowerCase()
    const userId = session?.user?.id
    const isOwner =
      Boolean(userId && order.userId === userId) ||
      Boolean(userEmail && (
        (order.guestEmail && order.guestEmail.toLowerCase() === userEmail) ||
        (order.customer?.email && order.customer.email.toLowerCase() === userEmail)
      ))

    if (isOwner) {
      return NextResponse.json({ success: true, data: order })
    }

    // 3. Guest tracking with phone number verification
    const orderPhone = (order.guestPhone || order.customer?.phone || '').replace(/[^0-9]/g, '')
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '')
    const phoneMatches =
      cleanPhone.length >= 4 &&
      (orderPhone.endsWith(cleanPhone) || orderPhone === cleanPhone)

    if (phoneMatches) {
      return NextResponse.json({ success: true, data: order })
    }

    // 4. Default: Return order with customer PII masked to prevent harvesting customer identities
    const sanitized = sanitizeOrderForPublic(order)
    return NextResponse.json({ success: true, data: sanitized, piiMasked: true })
  }

  // Listing all orders: Strictly requires ADMIN or STAFF clearance
  if (!isStaffOrAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Staff or Admin privilege required to view order queue.' },
      { status: 403 }
    )
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        payment: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.warn('[Orders] Prisma findMany fallback to local file store:', error)
  }

  const localOrders = loadOrdersFromFile()
  localOrders.sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
  return NextResponse.json({ success: true, data: localOrders })
}

export async function PUT(req: Request) {
  try {
    const session = await auth().catch(() => null)
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Kitchen staff or Admin privileges required to update orders.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, orderNumber, status, estimatedTime, notes } = body

    if (!id && !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order ID or orderNumber is required.' },
        { status: 400 }
      )
    }

    const updaterName = session.user.name || session.user.email || 'Kitchen Staff'

    // Update in Prisma if possible
    try {
      const updated = await prisma.order.update({
        where: orderNumber ? { orderNumber } : { id },
        data: {
          ...(status ? { status } : {}),
          ...(estimatedTime ? { estimatedTime: Number(estimatedTime) } : {}),
          ...(notes ? { notes } : {}),
        },
        include: { items: true, payment: true },
      })

      if (status) {
        await prisma.orderStatusHistory
          .create({
            data: {
              orderId: updated.id,
              status,
              note: `Status updated to ${status} by ${updaterName}`,
              updatedBy: session.user.id || updaterName,
            },
          })
          .catch(() => {})
      }

      saveOrderToFile(updated)
      return NextResponse.json({ success: true, data: updated })
    } catch {
      // Prisma offline, update in file store
    }

    const localOrders = loadOrdersFromFile()
    const index = localOrders.findIndex(
      (o) => o.orderNumber === orderNumber || o.id === id || o.orderNumber === id
    )

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 })
    }

    localOrders[index] = {
      ...localOrders[index],
      ...(status ? { status } : {}),
      ...(estimatedTime ? { estimatedTime: Number(estimatedTime) } : {}),
      ...(notes ? { notes } : {}),
      updatedAt: new Date().toISOString(),
      lastUpdatedBy: updaterName,
    }

    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2), 'utf-8')
    } catch {}

    return NextResponse.json({ success: true, data: localOrders[index] })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update order.' },
      { status: 500 }
    )
  }
}
