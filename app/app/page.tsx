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
  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setUserEmail(data.user.email ?? null)
        supabase
          .from('users')
          .select('is_pro, generations_used, agent_name, agent_phone')
          .eq('id', data.user.id)
          .single()
          .then(({ data: u }) => {
            if (u) {
              setIsPro(u.is_pro)
              setGenerationsUsed(u.generations_used)
              setAgentName(u.agent_name ?? '')
              setAgentPhone(u.agent_phone ?? '')
            }
          })
      } else {
        const count = parseInt(localStorage.getItem('pm_gen_count') || '0')
        setGenerationsUsed(count)
      }
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleSaveProfile = async () => {
    if (!userId) return
    await supabase.from('users').update({ agent_name: agentName, agent_phone: agentPhone }).eq('id', userId)
    setShowProfile(false)
  }

  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - generationsUsed)

  const handleGenerate = async () => {
    if (!selectedType || !form.name.trim() || !form.property.trim()) return
    if (remaining === 0) { window.location.href = '/upgrade'; return }

    const typeConfig = EMAIL_TYPES.find(t => t.id === selectedType)
    if (typeConfig?.pro && !isPro) { window.location.href = '/upgrade'; return }

    setLoading(true)
    setOutput('')

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, emailType: selectedType, userId, agentName, agentPhone }),
    })

    const data = await res.json()

    if (data.error === 'FREE_LIMIT_REACHED' || data.error === 'PRO_REQUIRED') {
      window.location.href = '/upgrade'
      return
    }

    setOutput(data.email || 'Something went wrong. Please try again.')
    setLoading(false)

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
            }}>Upgrade to Pro</Link>
          )}
          {isPro && userEmail && (
            <button onClick={() => setShowProfile(true)} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
              padding: '5px 10px', fontSize: '0.75rem', color: 'var(--fg2)', cursor: 'pointer'
            }}>My profile</button>
          )}
          {userEmail && (
            <button onClick={handleSignOut} style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
              padding: '5px 10px', fontSize: '0.75rem', color: 'var(--fg3)', cursor: 'pointer'
            }}>Sign out</button>
          )}
        </div>
      </header>

      {/* Profile modal */}
      {showProfile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#0f1621', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '360px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', color: 'var(--fg)', margin: 0 }}>Agent profile</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--fg3)', margin: 0 }}>Your name and phone will be added automatically to every email signature.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                style={inputStyle}
                placeholder="Your name (e.g. John Carter)"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Your phone (e.g. (312) 555-0198)"
                value={agentPhone}
                onChange={e => setAgentPhone(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowProfile(false)} style={{
                flex: 1, background: 'none', border: '1px solid var(--border)',
                borderRadius: '7px', padding: '10px', color: 'var(--fg3)', cursor: 'pointer', fontSize: '0.85rem'
              }}>Cancel</button>
              <button onClick={handleSaveProfile} style={{
                flex: 1, background: 'var(--blue)', border: 'none',
                borderRadius: '7px', padding: '10px', color: '#0b0f14', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
              }}>Save</button>
            </div>
          </div>
        </div>
      )}

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
            {EMAIL_TYPES.map(t => {
              const locked = t.pro && !isPro
              return (
                <button key={t.id} onClick={() => !locked && setSelectedType(t.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: selectedType === t.id ? 'var(--blue-dim)' : 'var(--surface)',
                  border: selectedType === t.id ? '1px solid var(--blue-border)' : '1px solid var(--border)',
                  borderRadius: '7px', padding: '9px 11px',
                  color: locked ? 'var(--fg3)' : selectedType === t.id ? 'var(--blue)' : 'var(--fg2)',
                  cursor: locked ? 'default' : 'pointer',
                  textAlign: 'left', fontSize: '0.84rem', transition: 'all 0.12s',
                  opacity: locked ? 0.5 : 1,
                }}>
                  <span style={{ minWidth: '16px' }}>{t.icon}</span>
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {locked && <span style={{ fontSize: '0.7rem', color: 'var(--blue)', background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', borderRadius: '4px', padding: '2px 6px' }}>Pro</span>}
                </button>
              )
            })}
          </div>

          <Label>DETAILS</Label>

          <Field label="Lead / client name">
            <input style={inputStyle} placeholder="e.g. Sarah Johnson"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>

          <Field label="Property">
            <input style={inputStyle} placeholder="e.g. 4BR colonial, Naperville IL"
              value={form.property} onChange={e => setForm(f => ({ ...f, property: e.target.value }))} />
          </Field>

          <Field label={<>
            {selectedType === 'custom' ? 'Your instructions' : 'Extra context'}
            {' '}<span style={{ fontSize: '0.68rem', color: 'var(--fg3)' }}>{selectedType === 'custom' ? '(required)' : '(optional)'}</span>
          </>}>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '68px' }}
              placeholder={selectedType === 'custom'
                ? 'Describe the email you need. e.g. "Write a thank you email to a seller who just listed with me"'
                : 'e.g. buyer has two kids, needs a big yard, wants to close by June...'}
              value={form.context}
              onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
            />
          </Field>

          <Field label="Tone">
            <div style={{ display: 'flex', gap: '7px' }}>
              {TONES.map(t => (
                <button key={t.id} onClick={() => setForm(f => ({ ...f, tone: t.id }))} style={{
                  flex: 1, background: form.tone === t.id ? 'var(--blue-dim)' : 'var(--surface)',
                  border: form.tone === t.id ? '1px solid var(--blue-border)' : '1px solid var(--border)',
                  borderRadius: '6px', padding: '8px',
                  color: form.tone === t.id ? 'var(--blue)' : 'var(--fg2)',
                  cursor: 'pointer', fontSize: '0.79rem', transition: 'all 0.12s'
                }}>{t.label}</button>
              ))}
            </div>
          </Field>

          <button onClick={handleGenerate}
            disabled={!canGenerate || loading || remaining === 0}
            style={{
              width: '100%', background: 'var(--blue)', border: 'none',
              borderRadius: '7px', padding: '13px',
              color: '#0b0f14', fontSize: '0.9rem', fontWeight: 600,
              letterSpacing: '0.02em', marginTop: '4px',
              opacity: (!canGenerate || loading || remaining === 0) ? 0.4 : 1,
              cursor: (!canGenerate || loading || remaining === 0) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.12s'
            }}>
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
              }}>{copied ? '✓ Copied' : 'Copy'}</button>
            )}
          </div>

          <div style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column'
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
              }}>{output}</pre>
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
