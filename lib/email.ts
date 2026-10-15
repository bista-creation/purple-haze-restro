import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'Purple Haze Restro <onboarding@resend.dev>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@purplehaze.com'

/**
 * Reusable Luxury HTML Email Wrapper for Purple Haze Restro & Garden
 */
function wrapEmailTemplate(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        .wrapper { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(91, 33, 182, 0.08); border: 1px solid #ede9fe; }
        .header { background: linear-gradient(135deg, #4c1d95 0%, #2e1065 100%); padding: 35px 25px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 5px 0 0 0; color: #fbbf24; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
        .content { padding: 35px 30px; font-size: 14px; line-height: 1.6; color: #334155; }
        .highlight-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 14px; padding: 18px 22px; margin: 24px 0; }
        .badge { display: inline-block; background-color: #f59e0b; color: #0f172a; font-weight: 800; font-size: 16px; padding: 8px 18px; border-radius: 10px; letter-spacing: 1px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .details-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .details-table td.label { font-weight: 600; color: #64748b; width: 35%; }
        .details-table td.value { font-weight: 700; color: #1e293b; }
        .cta-button { display: inline-block; background: #6b21a8; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 13px; margin: 15px 0; }
        .footer { background-color: #0f172a; padding: 25px 20px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; }
        .footer a { color: #fbbf24; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Purple Haze</h1>
          <p>Restro & Garden • Biratnagar</p>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #e2e8f0;">Purple Haze Restro & Garden</p>
          <p style="margin: 0 0 10px 0;">Airport Line, Airport Road, Biratnagar - 4, Morang, Nepal</p>
          <p style="margin: 0;">Hotline: <a href="tel:+9779851150987">+977 9851150987</a> | <a href="mailto:contact@purplehazerestro.com">contact@purplehazerestro.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * 1. Send VIP Newsletter Welcome Email
 */
export async function sendNewsletterWelcomeEmail(email: string) {
  const subject = 'Welcome to the Purple Haze VIP Club! 🌸 (Your 10% Voucher Inside)'
  const html = wrapEmailTemplate(
    subject,
    `
      <h2 style="color: #4c1d95; font-size: 20px; margin-top: 0;">Namaste & Welcome to Our Inner Circle! 🙏</h2>
      <p>Thank you for subscribing to the <strong>Purple Haze VIP Club</strong>. As Biratnagar's premier garden restro destination, we are thrilled to have you join our food-loving family.</p>
      
      <p>As a warm welcome, please enjoy <strong>10% off</strong> on your next online dining or delivery order:</p>
      
      <div class="highlight-box" style="text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b21a8; font-weight: 600; text-transform: uppercase;">Your VIP Promo Code:</p>
        <span class="badge">VIPWELCOME10</span>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #7e22ce;">Apply at checkout for 10% instant discount</p>
      </div>

      <h3 style="font-size: 14px; color: #1e293b; margin-bottom: 8px;">What You'll Enjoy as a VIP Member:</h3>
      <ul style="padding-left: 20px; margin-top: 0; color: #475569; font-size: 13px;">
        <li>Early invitations to seasonal food festivals and live acoustic music nights</li>
        <li>Secret chef's specials and festival tasting menus</li>
        <li>Priority reservations during holidays and Dashain/Tihar celebrations</li>
        <li>Exclusive member-only weekend discount codes</li>
      </ul>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://purple-haze-restro.vercel.app/menu" class="cta-button">Explore Biratnagar Menu & Order Online →</a>
      </div>
    `
  )

  return sendEmail({ to: email, subject, html })
}

/**
 * 2. Send Table Reservation Confirmation Email
 */
export async function sendReservationConfirmationEmail(params: {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  tableArea: string
  code: string
}) {
  const { name, email, phone, date, time, guests, tableArea, code } = params
  const subject = `Table Confirmed: ${code} - Purple Haze Restro & Garden`

  const areaNames: Record<string, string> = {
    OPEN_GARDEN: 'Open Garden & Water Fountain Side',
    INDOOR_DINING: 'Indoor Dining Hall (AC)',
    GAZEBO_PERGOLA: 'Private Gazebo Cabana',
    FAMILY_LOUNGE: 'Family Lounge & Kids Zone',
  }
  const displayArea = areaNames[tableArea] || tableArea

  const html = wrapEmailTemplate(
    subject,
    `
      <h2 style="color: #4c1d95; font-size: 20px; margin-top: 0;">Your Table Reservation is Received! 🍽️</h2>
      <p>Namaste <strong>${name}</strong>, we are preparing your table under the Biratnagar sky. Below are your reservation details:</p>

      <div class="highlight-box">
        <p style="margin: 0; font-size: 12px; color: #6b21a8; font-weight: 600;">RESERVATION REFERENCE CODE:</p>
        <p style="margin: 5px 0 0 0; font-size: 22px; font-weight: 800; color: #4c1d95; letter-spacing: 1px;">${code}</p>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Date:</td>
          <td class="value">${date}</td>
        </tr>
        <tr>
          <td class="label">Time:</td>
          <td class="value">${time}</td>
        </tr>
        <tr>
          <td class="label">Party Size:</td>
          <td class="value">${guests} Guests</td>
        </tr>
        <tr>
          <td class="label">Seating Area:</td>
          <td class="value">${displayArea}</td>
        </tr>
        <tr>
          <td class="label">Guest Phone:</td>
          <td class="value">${phone}</td>
        </tr>
        <tr>
          <td class="label">Status:</td>
          <td class="value" style="color: #059669;">CONFIRMED</td>
        </tr>
      </table>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        <em>Note: Your table will be held for 15 minutes past your reserved time. If you require rescheduling or have dietary preferences, please phone our Biratnagar concierge at +977 9851150987.</em>
      </p>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://purple-haze-restro.vercel.app/menu" class="cta-button">Browse Menu in Advance →</a>
      </div>
    `
  )

  return sendEmail({ to: email, subject, html })
}

/**
 * 3. Send Contact Inquiry Notification to Admin
 */
export async function sendContactInquiryNotification(params: {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
}) {
  const { name, email, phone, subject: inqSubject, message } = params
  const subject = `[New Contact Inquiry] ${inqSubject} - from ${name}`

  const html = wrapEmailTemplate(
    subject,
    `
      <h2 style="color: #4c1d95; font-size: 18px; margin-top: 0;">New Guest Inquiry Received 📬</h2>
      
      <table class="details-table">
        <tr>
          <td class="label">Sender Name:</td>
          <td class="value">${name}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td class="value"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone:</td>
          <td class="value">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td class="label">Subject:</td>
          <td class="value">${inqSubject}</td>
        </tr>
      </table>

      <div class="highlight-box">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #6b21a8; font-weight: 600;">GUEST MESSAGE:</p>
        <p style="margin: 0; font-size: 13px; color: #1e293b; white-space: pre-line;">${message}</p>
      </div>

      <p style="font-size: 12px; color: #64748b;">
        You can reply directly to this guest at <a href="mailto:${email}">${email}</a>.
      </p>
    `
  )

  return sendEmail({ to: ADMIN_EMAIL, subject, html })
}

/**
 * 4. Send Event / Banquet Booking Notification to Admin & Guest
 */
export async function sendEventBookingNotification(params: {
  name: string
  email: string
  phone: string
  eventType: string
  eventDate: string
  guests: number
  venue: string
  message?: string | null
  referenceId: string
}) {
  const { name, email, phone, eventType, eventDate, guests, venue, message, referenceId } = params
  const subject = `Event Booking Inquiry: ${referenceId} (${venue}) - ${name}`

  const html = wrapEmailTemplate(
    subject,
    `
      <h2 style="color: #4c1d95; font-size: 20px; margin-top: 0;">Banquet & Event Inquiry Received 🎪</h2>
      <p>Namaste <strong>${name}</strong>, thank you for considering Purple Haze Restro & Garden for your celebration!</p>

      <div class="highlight-box">
        <p style="margin: 0; font-size: 12px; color: #6b21a8; font-weight: 600;">INQUIRY REFERENCE ID:</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #4c1d95;">${referenceId}</p>
      </div>

      <table class="details-table">
        <tr>
          <td class="label">Requested Venue:</td>
          <td class="value">${venue}</td>
        </tr>
        <tr>
          <td class="label">Occasion / Type:</td>
          <td class="value">${eventType}</td>
        </tr>
        <tr>
          <td class="label">Event Date:</td>
          <td class="value">${eventDate}</td>
        </tr>
        <tr>
          <td class="label">Expected Guests:</td>
          <td class="value">${guests} Attendees</td>
        </tr>
        <tr>
          <td class="label">Contact Phone:</td>
          <td class="value">${phone}</td>
        </tr>
        ${
          message
            ? `<tr><td class="label">Special Notes:</td><td class="value">${message}</td></tr>`
            : ''
        }
      </table>

      <p style="font-size: 13px; color: #334155;">
        Our dedicated banquet & event coordinator will review venue availability and contact you within <strong>2 business hours</strong> with a customized food menu and seating plan.
      </p>
    `
  )

  // Send to guest and copy admin
  return Promise.all([
    sendEmail({ to: email, subject, html }),
    sendEmail({ to: ADMIN_EMAIL, subject: `[New Banquet Inquiry] ${subject}`, html }),
  ])
}

/**
 * 5. Send Order Placed Email to Customer
 */
export async function sendOrderPlacedEmail(params: {
  orderNumber: string
  customerEmail: string
  customerName: string
  orderType: string
  items: { dishName: string; quantity: number; unitPrice: number; totalPrice: number }[]
  pricing: { subtotal: number; deliveryFee: number; total: number; discount: number }
  paymentMethod: string
}) {
  const { orderNumber, customerEmail, customerName, orderType, items, pricing, paymentMethod } = params
  const subject = `Order Confirmed #${orderNumber} - Purple Haze Restro & Garden`

  const itemsRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">
            ${item.quantity}x ${item.dishName}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #4c1d95;">
            Rs. ${item.totalPrice}
          </td>
        </tr>
      `
    )
    .join('')

  const html = wrapEmailTemplate(
    subject,
    `
      <h2 style="color: #4c1d95; font-size: 20px; margin-top: 0;">Order Received & Cooking! 🍳</h2>
      <p>Namaste <strong>${customerName}</strong>, your order has been received by our kitchen staff.</p>

      <div class="highlight-box">
        <p style="margin: 0; font-size: 12px; color: #6b21a8; font-weight: 600;">ORDER NUMBER:</p>
        <p style="margin: 4px 0 0 0; font-size: 22px; font-weight: 800; color: #4c1d95; letter-spacing: 1px;">#${orderNumber}</p>
        <p style="margin: 6px 0 0 0; font-size: 11px; color: #7e22ce;">Order Type: <strong>${orderType}</strong> • Payment: <strong>${paymentMethod}</strong></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px;">
        ${itemsRows}
        <tr>
          <td style="padding: 10px 0 4px 0; color: #64748b;">Subtotal</td>
          <td style="padding: 10px 0 4px 0; text-align: right; font-weight: 600;">Rs. ${pricing.subtotal}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Delivery Fee</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600;">Rs. ${pricing.deliveryFee}</td>
        </tr>
        ${
          pricing.discount > 0
            ? `<tr><td style="padding: 4px 0; color: #059669;">Promo Discount</td><td style="padding: 4px 0; text-align: right; color: #059669; font-weight: 600;">- Rs. ${pricing.discount}</td></tr>`
            : ''
        }
        <tr style="border-top: 2px solid #e2e8f0;">
          <td style="padding: 10px 0; font-size: 15px; font-weight: 800; color: #1e293b;">Total Amount</td>
          <td style="padding: 10px 0; font-size: 16px; font-weight: 800; color: #7e22ce; text-align: right;">Rs. ${pricing.total}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://purple-haze-restro.vercel.app/track-order?orderNumber=${orderNumber}" class="cta-button">Track Live Kitchen Status →</a>
      </div>
    `
  )

  return sendEmail({ to: customerEmail, subject, html })
}

/**
 * Base email dispatcher
 * Gracefully falls back to structured console delivery if RESEND_API_KEY is not set
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Email Simulation] To: ${to} | Subject: "${subject}"`)
    }
    return { success: true, simulated: true }
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    return { success: true, id: data.data?.id }
  } catch (error) {
    console.error('[Email Dispatch Error]:', error)
    return { success: false, error }
  }
}
