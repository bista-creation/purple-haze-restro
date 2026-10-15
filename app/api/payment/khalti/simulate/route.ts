import { NextResponse } from 'next/server'
import { getAppBaseUrl } from '@/lib/payment'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const baseUrl = getAppBaseUrl(req)

  const pidx = url.searchParams.get('pidx') || 'k_sim_' + Date.now()
  const orderNumber = url.searchParams.get('orderNumber') || 'PH-TEST'
  const amount = url.searchParams.get('amount') || '500'

  const approveUrl = `${baseUrl}/api/payment/khalti/callback?pidx=${pidx}&status=Completed&purchase_order_id=${orderNumber}&txnId=KHLT-${Date.now()}`
  const cancelUrl = `${baseUrl}/checkout?error=khalti_cancelled&orderNumber=${orderNumber}`

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Khalti Sandbox Payment - Purple Haze</title>
      <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { max-width: 440px; width: 100%; background: #1e293b; border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid #334155; }
        .logo-box { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .badge { background: #5c2d91; color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; }
        .amount-box { background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: 800; color: #a855f7; margin: 4px 0 0 0; }
        .btn { display: block; width: 100%; padding: 14px; text-align: center; border-radius: 14px; font-size: 14px; font-weight: 700; text-decoration: none; box-sizing: border-box; transition: opacity 0.2s; margin-bottom: 10px; }
        .btn-primary { background: #5c2d91; color: #ffffff; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-cancel { background: transparent; color: #94a3b8; border: 1px solid #334155; }
        .btn-cancel:hover { background: #334155; }
        .note { font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-box">
          <div style="font-size: 24px; font-weight: 900; color: #a855f7;">Khalti</div>
          <span class="badge">Sandbox Simulator</span>
        </div>

        <h2 style="margin: 0 0 8px 0; font-size: 20px;">Purple Haze Restro & Garden</h2>
        <p style="margin: 0; font-size: 13px; color: #94a3b8;">Order #${orderNumber}</p>

        <div class="amount-box">
          <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Total Payable</div>
          <div class="amount">Rs. ${amount}</div>
        </div>

        <a href="${approveUrl}" class="btn btn-primary">
          ✓ Approve Test Payment
        </a>

        <a href="${cancelUrl}" class="btn btn-cancel">
          Cancel & Return to Cart
        </a>

        <p class="note">
          This is an interactive Khalti sandbox test screen. When you add a live <code>KHALTI_SECRET_KEY</code> in Vercel, this will automatically redirect to Khalti's official hosted payment portal.
        </p>
      </div>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
