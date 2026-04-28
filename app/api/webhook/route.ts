import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  // Verify webhook signature
  const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  if (hmac !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName: string = payload?.meta?.event_name ?? ''
  const userEmail: string = payload?.data?.attributes?.user_email ?? ''

  if (!userEmail) return NextResponse.json({ ok: true })

  if (
    eventName === 'subscription_created' ||
    eventName === 'subscription_resumed' ||
    eventName === 'order_created'
  ) {
    await supabaseAdmin
      .from('users')
      .update({ is_pro: true })
      .eq('email', userEmail)
  }

  if (
    eventName === 'subscription_cancelled' ||
    eventName === 'subscription_expired'
  ) {
    await supabaseAdmin
      .from('users')
      .update({ is_pro: false })
      .eq('email', userEmail)
  }

  return NextResponse.json({ ok: true })
}
