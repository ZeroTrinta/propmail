'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { EMAIL_TYPES, TONES } from '@/lib/prompts'
import Link from 'next/link'

type Generation = {
  id: string
  email_type: string
  type_label: string
  input_name: string
  input_property: string
  output: string
  created_at: string
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Generation | null>(null)
  const [copied, setCopied] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [regenOutput, setRegenOutput] = useState<string | null>(null)
  const [regenCopied, setRegenCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.replace('/login'); return }
      setUserId(data.user.id)

      supabase
        .from('users')
        .select('is_pro')
        .eq('id', data.user.id)
        .single()
        .then(({ data: u }) => {
          if (!u?.is_pro) { window.location.replace('/upgrade'); return }
          setAuthChecked(true)

          supabase
            .from('generations')
            .select('*')
            .eq('user_id', data.user.id)
            .order('created_at', { ascending: false })
            .limit(200)
            .then(({ data: g }) => {
              setGenerations(g ?? [])
              setLoading(false)
            })
        })
    })
  }, [])

  const filtered = generations.filter(g => {
    const q = search.toLowerCase()
    return (
      g.type_label.toLowerCase().includes(q) ||
      g.input_name.toLowerCase().includes(q) ||
      g.input_property.toLowerCase().includes(q)
    )
  })

  const handleCopy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setter(true)
    setTimeout(() => setter(false), 2000)
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true)
    await supabase.from('generations').delete().eq('id', selected.id)
    setGenerations(prev => prev.filter(g => g.id !== selected.id))
    setSelected(null)
    setRegenOutput(null)
    setDeleting(false)
  }

  const handleRegenerate = async () => {
    if (!selected) return
    setRegenerating(true)
    setRegenOutput(null)

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token ?? ''

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        emailType: selected.email_type,
        name: selected.input_name,
        property: selected.input_property,
        context: '',
        tone: 'balanced',
      }),
    })

    const data = await res.json()
    setRegenOutput(data.email || 'Something went wrong.')
    setRegenerating(false)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (!authChecked) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />

      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px', borderBottom: '1px solid var(--border)'
      }}>
        <Link href="/" style={{ fontFamily: 'Lora, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
          PropMail
        </Link>
        <Link href="/app" style={{
          background: 'var(--blue)', borderRadius: '7px', padding: '7px 16px',
          fontSize: '0.82rem', fontWeight: 600, color: '#0b0f14', textDecoration: 'none'
        }}>New email</Link>
      </header>

      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left list */}
        <div style={{ width: '340px', minWidth: '280px', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>EMAIL HISTORY</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--fg3)' }}>{filtered.length} email{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <input
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '6px', padding: '8px 10px',
                color: 'var(--fg)', fontSize: '0.82rem',
                fontFamily: 'DM Sans, sans-serif', width: '100%',
              }}
              placeholder="Search by name, property or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg3)', fontSize: '0.84rem' }}>Loading...</div>}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--fg3)', lineHeight: 1.6 }}>
                {search ? 'No results found.' : 'No emails generated yet.'}
              </p>
              {!search && <Link href="/app" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--blue)', fontSize: '0.84rem', textDecoration: 'none' }}>Generate your first email</Link>}
            </div>
          )}

          {!loading && filtered.map(g => (
            <button key={g.id} onClick={() => { setSelected(g); setRegenOutput(null) }} style={{
              display: 'flex', flexDirection: 'column', gap: '4px',
              padding: '14px 16px', textAlign: 'left',
              background: selected?.id === g.id ? 'var(--blue-dim)' : 'none',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              borderLeft: selected?.id === g.id ? '2px solid var(--blue)' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.1s'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: selected?.id === g.id ? 'var(--blue)' : 'var(--fg)' }}>{g.type_label}</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--fg3)' }}>{g.input_name} · {g.input_property}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--fg3)', opacity: 0.7 }}>{formatDate(g.created_at)}</span>
            </button>
          ))}
        </div>

        {/* Right preview */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0.3 }}>
              <span style={{ fontSize: '1.8rem', color: 'var(--blue)' }}>◈</span>
              <p style={{ fontSize: '0.86rem', color: 'var(--fg2)', textAlign: 'center' }}>Select an email from the list to preview it.</p>
            </div>
          ) : (
            <>
              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>{selected.type_label.toUpperCase()}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: '2px' }}>{selected.input_name} · {selected.input_property}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleRegenerate} disabled={regenerating} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '6px', padding: '5px 13px',
                    color: 'var(--fg2)', fontSize: '0.76rem', cursor: regenerating ? 'not-allowed' : 'pointer',
                    opacity: regenerating ? 0.5 : 1
                  }}>{regenerating ? 'Writing...' : '↺ Regenerate'}</button>
                  <button onClick={handleDelete} disabled={deleting} style={{
                    background: 'none', border: '1px solid rgba(252,129,129,0.3)',
                    borderRadius: '6px', padding: '5px 13px',
                    color: '#fc8181', fontSize: '0.76rem', cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.5 : 1
                  }}>{deleting ? 'Deleting...' : 'Delete'}</button>
                  <button onClick={() => handleCopy(selected.output, setCopied)} style={{
                    background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
                    borderRadius: '6px', padding: '5px 13px',
                    color: 'var(--blue)', fontSize: '0.76rem', cursor: 'pointer', letterSpacing: '0.05em'
                  }}>{copied ? '✓ Copied' : 'Copy'}</button>
                </div>
              </div>

              {/* Original email */}
              <div style={{
                flex: regenOutput ? '0 0 auto' : 1,
                maxHeight: regenOutput ? '45%' : undefined,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '24px', overflowY: 'auto'
              }}>
                <pre style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                  lineHeight: 1.78, color: 'rgba(232,237,242,0.82)',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>{selected.output}</pre>
              </div>

              {/* Regenerated version */}
              {(regenerating || regenOutput) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>NEW VERSION</p>
                    {regenOutput && (
                      <button onClick={() => handleCopy(regenOutput, setRegenCopied)} style={{
                        background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
                        borderRadius: '6px', padding: '5px 13px',
                        color: 'var(--blue)', fontSize: '0.76rem', cursor: 'pointer'
                      }}>{regenCopied ? '✓ Copied' : 'Copy'}</button>
                    )}
                  </div>
                  <div style={{
                    flex: 1, background: 'rgba(99,179,237,0.04)', border: '1px solid var(--blue-border)',
                    borderRadius: '10px', padding: '24px', overflowY: 'auto',
                    display: 'flex', alignItems: regenerating ? 'center' : 'flex-start', justifyContent: regenerating ? 'center' : 'flex-start'
                  }}>
                    {regenerating ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[0, 0.2, 0.4].map((d, i) => (
                          <span key={i} style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            background: 'var(--blue)', display: 'inline-block',
                            animation: `bounce 1.2s ${d}s infinite ease-in-out`
                          }} />
                        ))}
                      </div>
                    ) : (
                      <pre style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                        lineHeight: 1.78, color: 'rgba(232,237,242,0.82)',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                      }}>{regenOutput}</pre>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
