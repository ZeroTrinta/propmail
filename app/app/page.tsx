'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EMAIL_TYPES, TONES } from '@/lib/prompts'
import Link from 'next/link'

const FREE_LIMIT = 5

export default function AppPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', property: '', context: '', tone: 'balanced' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [generationsUsed, setGenerationsUsed] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setUserEmail(data.user.email ?? null)
        supabase
          .from('users')
          .select('is_pro, generations_used')
          .eq('id', data.user.id)
          .single()
          .then(({ data: u }) => {
            if (u) {
              setIsPro(u.is_pro)
              setGenerationsUsed(u.generations_used)
            }
          })
      } else {
        // Fallback: use localStorage for unauthenticated users
        const count = parseInt(localStorage.getItem('pm_gen_count') || '0')
        setGenerationsUsed(count)
      }
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - generationsUsed)

  const handleGenerate = async () => {
    if (!selectedType || !form.name.trim() || !form.property.trim()) return
    if (remaining === 0) { window.location.href = '/upgrade'; return }

    setLoading(true)
    setOutput('')

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, emailType: selectedType, userId }),
    })

    const data = await res.json()

    if (data.error === 'FREE_LIMIT_REACHED') {
      window.location.href = '/upgrade'
      return
    }

    setOutput(data.email || 'Something went wrong. Please try again.')
    setLoading(false)

    // Update local count if unauthenticated
    if (!userId) {
      const next = generationsUsed + 1
      setGenerationsUsed(next)
      localStorage.setItem('pm_gen_count', String(next))
    } else {
      setGenerationsUsed(g => g + 1)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canGenerate = selectedType && form.name.trim() && form.property.trim()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px', borderBottom: '1px solid var(--border)'
      }}>
        <Link href="/" style={{ fontFamily: 'Lora, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
          PropMail
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!userEmail && (
            <Link href="/login" style={{ fontSize: '0.78rem', color: 'var(--fg3)', textDecoration: 'none' }}>Sign in</Link>
          )}
          {isPro ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--blue)', letterSpacing: '0.08em' }}>PRO</span>
          ) : remaining > 0 ? (
            <span style={{ fontSize: '0.78rem', color: 'var(--fg3)' }}>{remaining} free email{remaining !== 1 ? 's' : ''} left</span>
          ) : (
            <Link href="/upgrade" style={{
              background: 'var(--blue)', border: 'none', borderRadius: '20px',
              padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600,
              color: '#0b0f14', textDecoration: 'none'
            }}>
              Upgrade to Pro
            </Link>
          )}
          {userEmail && (
            <button onClick={handleSignOut} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
              padding: '5px 10px', fontSize: '0.75rem', color: 'var(--fg3)', cursor: 'pointer'
            }}>Sign out</button>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel */}
        <div style={{
          width: '360px', minWidth: '320px',
          padding: '24px', borderRight: '1px solid var(--border)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px'
        }}>
          <Label>EMAIL TYPE</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {EMAIL_TYPES.map(t => (
              <button key={t.id} onClick={() => setSelectedType(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: selectedType === t.id ? 'var(--blue-dim)' : 'var(--surface)',
                border: selectedType === t.id ? '1px solid var(--blue-border)' : '1px solid var(--border)',
                borderRadius: '7px', padding: '9px 11px',
                color: selectedType === t.id ? 'var(--blue)' : 'var(--fg2)',
                cursor: 'pointer', textAlign: 'left', fontSize: '0.84rem', transition: 'all 0.12s'
              }}>
                <span style={{ minWidth: '16px' }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <Label>DETAILS</Label>

          <Field label="Lead / client name">
            <input
              style={inputStyle}
              placeholder="e.g. Sarah Johnson"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </Field>

          <Field label="Property">
            <input
              style={inputStyle}
              placeholder="e.g. 4BR colonial, Naperville IL"
              value={form.property}
              onChange={e => setForm(f => ({ ...f, property: e.target.value }))}
            />
          </Field>

          <Field label={<>Extra context <span style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>(optional)</span></>}>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '68px' }}
              placeholder="e.g. buyer has two kids, needs a big yard, wants to close by June..."
              value={form.context}
              onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
            />
          </Field>

          <Field label="Tone">
            <div style={{ display: 'flex', gap: '7px' }}>
              {TONES.map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, tone: t.id }))} style={{
                  flex: 1,
                  background: form.tone === t.id ? 'var(--blue-dim)' : 'var(--surface)',
                  border: form.tone === t.id ? '1px solid var(--blue-border)' : '1px solid var(--border)',
                  borderRadius: '6px', padding: '8px',
                  color: form.tone === t.id ? 'var(--blue)' : 'var(--fg2)',
                  cursor: 'pointer', fontSize: '0.79rem', transition: 'all 0.12s'
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </Field>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading || remaining === 0}
            style={{
              width: '100%', background: 'var(--blue)', border: 'none',
              borderRadius: '7px', padding: '13px',
              color: '#0b0f14', fontSize: '0.9rem', fontWeight: 600,
              letterSpacing: '0.02em', marginTop: '4px',
              opacity: (!canGenerate || loading || remaining === 0) ? 0.4 : 1,
              cursor: (!canGenerate || loading || remaining === 0) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.12s'
            }}
          >
            {loading ? 'Writing...' : remaining === 0 ? 'Limit reached' : 'Generate email'}
          </button>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>GENERATED EMAIL</Label>
            {output && (
              <button onClick={handleCopy} style={{
                background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
                borderRadius: '6px', padding: '5px 13px',
                color: 'var(--blue)', fontSize: '0.76rem', cursor: 'pointer', letterSpacing: '0.05em'
              }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div style={{
            flex: 1, background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px', padding: '24px',
            overflowY: 'auto', display: 'flex', flexDirection: 'column'
          }}>
            {loading && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--blue)', display: 'inline-block',
                      animation: `bounce 1.2s ${d}s infinite ease-in-out`
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--fg3)', letterSpacing: '0.05em' }}>Writing your email...</p>
              </div>
            )}
            {!loading && !output && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0.3 }}>
                <span style={{ fontSize: '1.8rem', color: 'var(--blue)' }}>✦</span>
                <p style={{ fontSize: '0.86rem', textAlign: 'center', maxWidth: '260px', lineHeight: 1.6, color: 'var(--fg2)' }}>
                  Pick an email type, fill in the details, and hit generate.
                </p>
              </div>
            )}
            {!loading && output && (
              <pre style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                lineHeight: 1.78, color: 'rgba(232,237,242,0.82)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word'
              }}>
                {output}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>{children}</p>
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.76rem', color: 'var(--fg2)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: '7px', padding: '9px 11px',
  color: 'var(--fg)', fontSize: '0.87rem',
  fontFamily: 'DM Sans, sans-serif', width: '100%', transition: 'border-color 0.12s'
}
