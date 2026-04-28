import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'
import { SYSTEM_PROMPTS, EMAIL_TYPES } from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FREE_LIMIT = 5

export async function POST(req: NextRequest) {
  try {
    const { emailType, name, property, context, tone, userId, agentName, agentPhone } = await req.json()

    if (!emailType || !name || !property) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (!SYSTEM_PROMPTS[emailType]) {
      return NextResponse.json({ error: 'Invalid email type.' }, { status: 400 })
    }

    // Check if type is pro-only
    const typeConfig = EMAIL_TYPES.find(t => t.id === emailType)
    const isProType = typeConfig?.pro ?? false

    // Check user status
    let isPro = false
    if (userId) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('is_pro, generations_used, generations_reset_at')
        .eq('id', userId)
        .single()

      if (user) {
        isPro = user.is_pro

        if (!isPro) {
          // Check if monthly reset is due
          const resetAt = user.generations_reset_at ? new Date(user.generations_reset_at) : null
          const now = new Date()
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

          if (!resetAt || resetAt < oneMonthAgo) {
            // Reset counter
            await supabaseAdmin
              .from('users')
              .update({ generations_used: 0, generations_reset_at: now.toISOString() })
              .eq('id', userId)
            user.generations_used = 0
          }

          if (user.generations_used >= FREE_LIMIT) {
            return NextResponse.json({ error: 'FREE_LIMIT_REACHED' }, { status: 403 })
          }
        }
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

    const agentSignature = agentName
      ? `Agent name: ${agentName}${agentPhone ? `, Phone: ${agentPhone}` : ''}`
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

    // Increment usage counter
    if (userId) {
      await supabaseAdmin.rpc('increment_generations', { user_id: userId })
    }

    return NextResponse.json({ email: text })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}
