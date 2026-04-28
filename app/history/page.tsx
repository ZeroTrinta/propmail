'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.replace('/login'); return }

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
            .limit(100)
            .then(({ data: g }) => {
              setGenerations(g ?? [])
              setLoading(false)
            })
        })
    })
  }, [])

  const handleCopy = () => {
    if (!selected) return
    navigator.clipboard.writeText(selected.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <div style={{ width: '340px', minWidth: '280px', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>EMAIL HISTORY</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: '4px' }}>{generations.length} email{generations.length !== 1 ? 's' : ''} generated</p>
          </div>

          {loading && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg3)', fontSize: '0.84rem' }}>Loading...</div>}

          {!loading && generations.length === 0 && (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--fg3)', lineHeight: 1.6 }}>No emails generated yet.</p>
              <Link href="/app" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--blue)', fontSize: '0.84rem', textDecoration: 'none' }}>Generate your first email</Link>
            </div>
          )}

          {!loading && generations.map(g => (
            <button key={g.id} onClick={() => setSelected(g)} style={{
              display: 'flex', flexDirection: 'column', gap: '4px',
              padding: '14px 20px', textAlign: 'left',
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

        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'hidden' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: 0.3 }}>
              <span style={{ fontSize: '1.8rem', color: 'var(--blue)' }}>◈</span>
              <p style={{ fontSize: '0.86rem', color: 'var(--fg2)', textAlign: 'center' }}>Select an email from the list to preview it.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'var(--blue)', fontWeight: 500 }}>{selected.type_label.toUpperCase()}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--fg3)', marginTop: '2px' }}>{selected.input_name} · {selected.input_property}</p>
                </div>
                <button onClick={handleCopy} style={{
                  background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
                  borderRadius: '6px', padding: '5px 13px',
                  color: 'var(--blue)', fontSize: '0.76rem', cursor: 'pointer', letterSpacing: '0.05em'
                }}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>

              <div style={{
                flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '24px', overflowY: 'auto'
              }}>
                <pre style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
                  lineHeight: 1.78, color: 'rgba(232,237,242,0.82)',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                }}>{selected.output}</pre>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
