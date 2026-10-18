import { RESTAURANT_INFO } from '@/lib/data/restaurant-data'

export const ADMIN_WHATSAPP_NUMBER = '9851150987'
export const ADMIN_WHATSAPP_INTERNATIONAL = '9779851150987'

/**
 * Format an order object into a clean, professional WhatsApp receipt
 */
export function formatOrderForWhatsApp(order: any): string {
  if (!order) return ''

  const orderNum = order.orderNumber || order.id || 'N/A'
  const customerName = order.customer?.name || order.guestName || 'Valued Guest'
  const customerPhone = order.customer?.phone || order.guestPhone || 'Not provided'
  const customerEmail = order.customer?.email || order.guestEmail || ''
  const orderType = order.orderType || 'DELIVERY'
  const tableNum = order.tableNumber ? `Table: ${order.tableNumber}` : ''
  const address = order.address || order.deliveryAddress
  const addressStr = address
    ? typeof address === 'string'
      ? address
      : `${address.street || ''}, ${address.area || ''}, ${address.city || 'Biratnagar'}${
          address.landmark ? ` (Near ${address.landmark})` : ''
        }`.replace(/^,\s*/, '')
    : ''

  const itemsList = Array.isArray(order.items)
    ? order.items
        .map((it: any) => {
          const name = it.dishName || it.name || 'Dish'
          const qty = it.quantity || 1
          const price = it.totalPrice || it.unitPrice * qty || it.price || 0
          const variant = it.variantName || it.variant ? ` (${it.variantName || it.variant})` : ''
          return `  • ${qty}x ${name}${variant} - NPR ${price}`
        })
        .join('\n')
    : '  • General Order Items'

  const subtotal = order.pricing?.subtotal || order.subtotal || 0
  const deliveryFee = order.pricing?.deliveryFee || order.deliveryFee || 0
  const discount = order.pricing?.discount || order.discountAmount || 0
  const total = order.pricing?.total || order.totalAmount || order.total || 0
  const paymentMethod = order.payment?.method || order.paymentMethod || 'CASH_ON_DELIVERY'
  const paymentStatus = order.payment?.status || 'PENDING'
  const notes = order.notes || order.orderNotes || ''

  return `🍽️ *PURPLE HAZE RESTRO & GARDEN*
📍 Airport Line, Biratnagar, Nepal
---------------------------------
🔔 *NEW ORDER NOTIFICATION*
---------------------------------
📋 *Order ID:* #${orderNum}
🕒 *Date:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}
🛵 *Type:* ${orderType} ${tableNum ? `(${tableNum})` : ''}

👤 *Customer Details:*
• Name: ${customerName}
• Phone: ${customerPhone}${customerEmail ? `\n• Email: ${customerEmail}` : ''}${
    addressStr ? `\n• Delivery Address: ${addressStr}` : ''
  }

📦 *Ordered Items:*
${itemsList}

💰 *Payment Summary:*
• Subtotal: NPR ${subtotal}
${deliveryFee ? `• Delivery Fee: NPR ${deliveryFee}\n` : ''}${
    discount ? `• Discount: -NPR ${discount}\n` : ''
  }• *Grand Total: NPR ${total}*
• Payment: ${paymentMethod.replace(/_/g, ' ')} (${paymentStatus})

${notes ? `📝 *Special Instructions:*\n"${notes}"\n\n` : ''}---------------------------------
📞 Restaurant Helpline: +977 9852022202`
}

/**
 * Generate a direct WhatsApp click-to-chat URL for an order
 */
export function getWhatsAppOrderUrl(
  order: any,
  phoneNumber: string = ADMIN_WHATSAPP_INTERNATIONAL
): string {
  const text = formatOrderForWhatsApp(order)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
}

/**
 * Server-side notification trigger (sends webhook or logs alert)
 */
export async function sendWhatsAppOrderAlert(order: any): Promise<boolean> {
  const message = formatOrderForWhatsApp(order)
  const phone = process.env.WHATSAPP_NOTIFICATION_PHONE || ADMIN_WHATSAPP_INTERNATIONAL

  // Log in server console for audit trail
  console.log(`[WhatsApp Alert to ${phone}]: New order #${order.orderNumber || order.id} queued.`)

  // If a third-party WhatsApp gateway webhook (e.g. CallMeBot, Wasme, GreenAPI) is configured
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message, orderNumber: order.orderNumber || order.id }),
      })
      return true
    } catch (err) {
      console.warn('[WhatsApp Alert]: Webhook dispatch deferred:', err)
    }
  }

  return true
}
