'use client'
import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/app'
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email to confirm your account, then sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = redirect
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Link href="/" style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue)', textDecoration: 'none' }}>
          PropMail
        </Link>
        <p style={{ marginTop: '8px', fontSize: '0.88rem', color: 'var(--fg2)' }}>
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </p>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
              background: mode === m ? 'var(--blue-dim)' : 'transparent',
              border: mode === m ? '1px solid var(--blue-border)' : '1px solid transparent',
              color: mode === m ? 'var(--blue)' : 'var(--fg3)',
            }}>
              {m === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ fontSize: '0.8rem', color: '#fc8181' }}>{error}</p>}
        {success && <p style={{ fontSize: '0.8rem', color: '#68d391' }}>{success}</p>}

        <button onClick={handleSubmit} disabled={loading || !email || !password} style={{
          width: '100%', background: 'var(--blue)', border: 'none', borderRadius: '7px',
          padding: '12px', color: '#0b0f14', fontSize: '0.9rem', fontWeight: 600,
          cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
          opacity: loading || !email || !password ? 0.5 : 1,
          transition: 'opacity 0.12s'
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--fg3)' }}>
        <Link href="/" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>Back to home</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)', position: 'relative' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 15% 5%, #0d1f35 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 85% 85%, #091a2a 0%, transparent 55%)'
      }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(232,237,242,0.05)', border: '1px solid var(--border)',
  borderRadius: '7px', padding: '10px 12px',
  color: 'var(--fg)', fontSize: '0.87rem',
  fontFamily: 'DM Sans, sans-serif', width: '100%',
}
