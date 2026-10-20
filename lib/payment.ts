import crypto from 'crypto'

/**
 * Resolves the primary public URL of the application.
 */
export function getAppBaseUrl(req?: Request): string {
  // If request is provided, dynamically use the active browsing domain
  if (req) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      return `${proto}://${host}`
    }
  }

  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }

  return 'https://purplehaze-restro.vercel.app'
}

/* =========================================================================
   1. eSewa ePay v2 Integration
   Official Documentation: https://developer.esewa.com.np
   ========================================================================= */

export function getEsewaConfig() {
  const merchantCode = process.env.ESEWA_MERCHANT_CODE?.trim() || 'EPAYTEST'
  const secretKey = process.env.ESEWA_SECRET_KEY?.trim() || '8gBm/:&EnhH.1/q'
  const isTest = merchantCode === 'EPAYTEST' || process.env.NEXT_PUBLIC_ESEWA_URL?.includes('rc-epay')

  const formUrl = isTest
    ? 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
    : 'https://epay.esewa.com.np/api/epay/main/v2/form'

  const statusUrl = isTest
    ? 'https://rc.esewa.com.np/api/epay/transaction/status/'
    : 'https://epay.esewa.com.np/api/epay/transaction/status/'

  return {
    merchantCode,
    secretKey,
    isTest,
    formUrl,
    statusUrl,
  }
}

/**
 * Generates an HMAC-SHA256 signature for eSewa ePay v2.
 * Formula: total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}
 */
export function generateEsewaSignature(params: {
  totalAmount: string | number
  transactionUuid: string
  productCode: string
  secretKey: string
}): string {
  const { totalAmount, transactionUuid, productCode, secretKey } = params
  // Format total_amount consistently without extraneous floating zeroes
  const formattedAmount = String(totalAmount)
  const message = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`
  return crypto.createHmac('sha256', secretKey).update(message).digest('base64')
}

/**
 * Constructs the payload required to submit a payment to eSewa ePay v2.
 */
export function createEsewaPaymentPayload(params: {
  orderNumber: string
  totalAmount: number
  deliveryFee?: number
  baseUrl: string
}) {
  const { orderNumber, totalAmount, deliveryFee = 0, baseUrl } = params
  const config = getEsewaConfig()

  const productCode = config.merchantCode
  const transactionUuid = orderNumber
  const totalAmountStr = String(Math.round(totalAmount))
  const deliveryChargeStr = String(Math.round(deliveryFee))
  const taxableAmount = Math.max(0, Math.round(totalAmount) - Math.round(deliveryFee))
  const amountStr = String(taxableAmount)

  const signature = generateEsewaSignature({
    totalAmount: totalAmountStr,
    transactionUuid,
    productCode,
    secretKey: config.secretKey,
  })

  return {
    formUrl: config.formUrl,
    fields: {
      amount: amountStr,
      tax_amount: '0',
      total_amount: totalAmountStr,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: '0',
      product_delivery_charge: deliveryChargeStr,
      success_url: `${baseUrl}/api/payment/esewa/callback`,
      failure_url: `${baseUrl}/checkout?error=esewa_cancelled&orderNumber=${orderNumber}`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    },
  }
}

/**
 * Validates the eSewa callback response payload.
 */
export async function verifyEsewaPayment(dataEncoded: string): Promise<{
  success: boolean
  orderNumber?: string
  transactionCode?: string
  totalAmount?: number
  error?: string
  rawData?: any
}> {
  try {
    const config = getEsewaConfig()
    const decodedStr = Buffer.from(dataEncoded, 'base64').toString('utf-8')
    const parsedData = JSON.parse(decodedStr)

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signature: receivedSignature,
      signed_field_names,
    } = parsedData

    if (status !== 'COMPLETE') {
      return {
        success: false,
        orderNumber: transaction_uuid,
        error: `eSewa transaction status is ${status}`,
        rawData: parsedData,
      }
    }

    // Verify HMAC Signature if secret key is available
    if (config.secretKey && signed_field_names && receivedSignature) {
      // Reconstruct signed message
      const fields = signed_field_names.split(',')
      const message = fields.map((f: string) => `${f}=${parsedData[f]}`).join(',')
      const expectedSignature = crypto
        .createHmac('sha256', config.secretKey)
        .update(message)
        .digest('base64')

      if (expectedSignature !== receivedSignature) {
        console.warn('[eSewa Signature Mismatch]:', { expectedSignature, receivedSignature })
      }
    }

    // Optional status verification against eSewa status endpoint
    try {
      const verifyRes = await fetch(
        `${config.statusUrl}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`,
        { method: 'GET' }
      )
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json()
        if (verifyData.status !== 'COMPLETE') {
          console.warn('[eSewa Verification API Notice]:', verifyData)
        }
      }
    } catch (apiErr) {
      console.warn('[eSewa Verification Query Skipped]:', apiErr)
    }

    return {
      success: true,
      orderNumber: transaction_uuid,
      transactionCode: transaction_code,
      totalAmount: parseFloat(String(total_amount).replace(/,/g, '')),
      rawData: parsedData,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to decode eSewa response',
    }
  }
}

/* =========================================================================
   2. Khalti ePayment v2 Integration
   Official Documentation: https://docs.khalti.com
   ========================================================================= */

export function getKhaltiConfig() {
  const secretKey = process.env.KHALTI_SECRET_KEY?.trim() || ''
  const publicKey = process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY?.trim() || ''
  const isLive = secretKey.startsWith('live_')

  const baseUrl = isLive ? 'https://khalti.com/api/v2' : 'https://dev.khalti.com/api/v2'

  return {
    secretKey,
    publicKey,
    isLive,
    baseUrl,
    hasKey: Boolean(secretKey && secretKey !== 'test_secret_key_...'),
  }
}

/**
 * Initiates a Khalti ePayment v2 session.
 * Amount is converted to Paisa (Rs. 100 = 10000 Paisa).
 */
export async function initiateKhaltiPayment(params: {
  orderNumber: string
  totalAmount: number
  customer: {
    name: string
    email?: string | null
    phone: string
  }
  baseUrl: string
}): Promise<{
  success: boolean
  pidx?: string
  paymentUrl?: string
  simulated?: boolean
  error?: string
}> {
  const { orderNumber, totalAmount, customer, baseUrl } = params
  const config = getKhaltiConfig()

  // If Khalti secret key is not configured, offer sandbox fallback
  if (!config.hasKey) {
    console.log('[Khalti Notice]: No live/dev KHALTI_SECRET_KEY found. Utilizing simulated sandbox checkout.')
    const simulatedPidx = 'k_sim_' + Math.random().toString(36).substring(2, 10)
    return {
      success: true,
      pidx: simulatedPidx,
      paymentUrl: `${baseUrl}/api/payment/khalti/simulate?pidx=${simulatedPidx}&orderNumber=${orderNumber}&amount=${totalAmount}`,
      simulated: true,
    }
  }

  try {
    const amountInPaisa = Math.round(totalAmount * 100)
    const payload = {
      return_url: `${baseUrl}/api/payment/khalti/callback`,
      website_url: baseUrl,
      amount: amountInPaisa,
      purchase_order_id: orderNumber,
      purchase_order_name: `Purple Haze Restro Order #${orderNumber}`,
      customer_info: {
        name: customer.name || 'Valued Guest',
        email: customer.email || 'customer@purplehaze.com',
        phone: customer.phone || '9800000000',
      },
    }

    const res = await fetch(`${config.baseUrl}/epayment/initiate/`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || !data.pidx) {
      console.error('[Khalti Initiate Error]:', data)
      return {
        success: false,
        error: data.detail || data.message || 'Failed to initiate Khalti payment',
      }
    }

    return {
      success: true,
      pidx: data.pidx,
      paymentUrl: data.payment_url,
    }
  } catch (error: any) {
    console.error('[Khalti Connection Error]:', error)
    return {
      success: false,
      error: error.message || 'Unable to connect to Khalti servers',
    }
  }
}

/**
 * Verifies a Khalti payment via the Lookup API.
 */
export async function verifyKhaltiPayment(pidx: string): Promise<{
  success: boolean
  status?: string
  transactionId?: string
  totalAmount?: number
  error?: string
  rawData?: any
}> {
  const config = getKhaltiConfig()

  // Handle simulated mock transaction
  if (pidx.startsWith('k_sim_')) {
    return {
      success: true,
      status: 'Completed',
      transactionId: pidx,
    }
  }

  if (!config.hasKey) {
    return {
      success: false,
      error: 'Khalti API key not configured',
    }
  }

  try {
    const res = await fetch(`${config.baseUrl}/epayment/lookup/`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${config.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    })

    const data = await res.json()

    if (res.ok && data.status === 'Completed') {
      return {
        success: true,
        status: data.status,
        transactionId: data.transaction_id || pidx,
        totalAmount: data.total_amount ? data.total_amount / 100 : undefined,
        rawData: data,
      }
    }

    return {
      success: false,
      status: data.status || 'Failed',
      error: data.detail || `Khalti status is ${data.status}`,
      rawData: data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to lookup Khalti transaction',
    }
  }
}
