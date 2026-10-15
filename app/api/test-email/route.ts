import { NextResponse } from 'next/server'
import { testEmailConnection, getFromEmail, getAdminEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const customEmail = url.searchParams.get('to') || undefined

    const fromUsed = getFromEmail()
    const targetEmail = customEmail || getAdminEmail()
    const hasKey = !!process.env.RESEND_API_KEY

    const result = await testEmailConnection(targetEmail)

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      diagnostics: {
        hasResendApiKey: hasKey,
        keyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 7) + '...' : 'NONE',
        fromEmailUsed: fromUsed,
        recipient: targetEmail,
        rawEnvFrom: process.env.RESEND_FROM_EMAIL || null,
        rawEnvAdmin: process.env.ADMIN_EMAIL || null,
      },
      result,
      message: result.success
        ? `Test email sent successfully to ${targetEmail}! Please check your Inbox and Spam folder.`
        : `Email delivery failed: ${result.error?.message || JSON.stringify(result.error)}`,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    )
  }
}
