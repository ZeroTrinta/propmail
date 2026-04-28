import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { SYSTEM_PROMPTS, EMAIL_TYPES } from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FREE_LIMIT = 5

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    const { emailType, name, property, context, tone, agentName, agentPhone, brokerage, licenseNumber, website, signature } = await req.json()

    if (!emailType || !name || !property) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!SYSTEM_PROMPTS[emailType]) {
      return NextResponse.json({ error: 'Invalid email type.' }, { status: 400 })
    }

    const typeConfig = EMAIL_TYPES.find(t => t.id === emailType)
    const isProType = typeConfig?.pro ?? false

    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('is_pro, generations_used, generations_reset_at')
      .eq('id', userId)
      .single()

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const isPro = dbUser.is_pro

    if (!isPro) {
      const resetAt = dbUser.generations_reset_at ? new Date(dbUser.generations_reset_at) : null
      const now = new Date()
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

      if (!resetAt || resetAt < oneMonthAgo) {
        await supabaseAdmin
          .from('users')
          .update({ generations_used: 0, generations_reset_at: now.toISOString() })
          .eq('id', userId)
        dbUser.generations_used = 0
      }

      if (dbUser.generations_used >= FREE_LIMIT) {
        return NextResponse.json({ error: 'FREE_LIMIT_REACHED' }, { status: 403 })
      }
    }

    if (isProType && !isPro) {
      return NextResponse.json({ error: 'PRO_REQUIRED' }, { status: 403 })
    }

    const toneDesc: Record<string, string> = {
      formal:   'formal and highly professional',
      balanced: 'balanced, professional but approachable',
      friendly: 'warm, friendly and personal',
    }

    const typeLabel = typeConfig?.label ?? emailType
    const agentSignature = signature
      ? `Agent signature block to use at the end of the email:\n${signature}`
      : agentName
        ? `Agent name: ${agentName}${agentPhone ? `, Phone: ${agentPhone}` : ''}${brokerage ? `, Brokerage: ${brokerage}` : ''}${licenseNumber ? `, License: ${licenseNumber}` : ''}${website ? `, Website: ${website}` : ''}`
        : ''

    const userPrompt = `
Email type: ${typeLabel}
Lead/client name: ${name}
Property: ${property}
Additional context: ${context || 'None provided'}
Desired tone: ${toneDesc[tone] ?? 'balanced'}
${agentSignature}
`.trim()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPTS[emailType],
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')

    await supabaseAdmin.rpc('increment_generations', { user_id: userId })

    // Save to history for Pro users
    if (isPro) {
      await supabaseAdmin.from('generations').insert({
        user_id: userId,
        email_type: emailType,
        type_label: typeLabel,
        input_name: name,
        input_property: property,
        output: text,
      })
    }

    return NextResponse.json({ email: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}
